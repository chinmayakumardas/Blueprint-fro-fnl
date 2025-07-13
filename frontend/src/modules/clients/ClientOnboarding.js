

"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { format } from "date-fns";

import { ArrowLeft, X, UploadCloud, FileText, FileImage, File } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  addClient,
  updateFormData,
  addFile,
  removeFile,
  resetForm,
} from "@/features/clientSlice";
import { fetchIndustries } from "@/features/master/industriesMasterSlice";

export default function AddClient() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { formData, addLoading } = useSelector((state) => state.client);
  const { industries, loading: industriesLoading } = useSelector((state) => state.industries);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const validate = (name, value) => {
    const val = DOMPurify.sanitize(value);
    const err = {
      website: val && !val.match(/^https?:\/\/.+\..+$/) && "Invalid URL",
      contactEmail: !val.match(/^\S+@\S+\.\S+$/) && "Invalid email",
      contactNo: !val.match(/^[\d\s+-]{7,15}$/) && "Invalid phone",
      address: val.length < 5 && "Too short",
      clientName: val.length < 2 && "Too short",
      industryType: val.length < 2 && "Required",
      contactPersonName: val.length < 2 && "Too short",
    };
    return err[name] || "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileData") return handleFiles(files);
    dispatch(updateFormData({ [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleFiles = (files) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrors((e) => ({ ...e, fileData: "Invalid file type" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((e) => ({ ...e, fileData: "Max size 5MB" }));
        return;
      }
      dispatch(addFile({ name: file.name, size: file.size, type: file.type, data: file, isNew: true }));
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMap = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== "fileData") errMap[k] = validate(k, v);
    });
    const hasErrors = Object.values(errMap).some(Boolean);
    setErrors(errMap);
    if (hasErrors) return;

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "fileData" && Array.isArray(v)) {
        v.forEach((f) => f.data && payload.append("fileData", f.data));
      } else if (v) {
        payload.append(k, v);
      }
    });

    if (selectedDate) {
      payload.append("onboardingDate", selectedDate.toISOString());
    }

    try {
      await dispatch(addClient(payload)).unwrap();
      dispatch(resetForm());
      toast.success("Client Onboarded");
      router.push("/client");
    } catch {
      toast.error("Submission failed");
    }
  };

  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes("image")) return <FileImage className="w-4 h-4 text-green-500" />;
    if (type.includes("word")) return <FileText className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-xl">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full text-gray-700 border border-gray-300 hover:bg-gray-100 px-3 py-1"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <CardTitle className="text-xl font-semibold text-gray-800">Client Onboarding Form</CardTitle>
          <div className="w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["clientName", "industryType", "contactEmail", "contactNo", "contactPersonName", "website", "address"].map((name) => {
            const labelMap = {
              clientName: "Client Name",
              industryType: "Industry Type",
              contactEmail: "Email",
              contactNo: "Contact Number",
              contactPersonName: "Contact Person",
              website: "Website (optional)",
              address: "Address",
            };
            return (
              <div key={name} className="flex flex-col w-full">
                <Label htmlFor={name}>{labelMap[name]}</Label>
                {name === "address" ? (
                  <Textarea id={name} name={name} value={formData[name] || ""} onChange={handleChange} className="mt-1" />
                ) : name === "industryType" ? (
                  <Select value={formData[name] || ""} onValueChange={(val) => dispatch(updateFormData({ [name]: val }))}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind._id} value={ind.Industryname}>{ind.Industryname}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id={name} name={name} type="text" value={formData[name] || ""} onChange={handleChange} className="mt-1" />
                )}
                {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
              </div>
            );
          })}

          <div className="sm:col-span-2">
            <Label>Onboarding Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal mt-1 w-full">
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setCalendarOpen(false);
                    setSelectedDate(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.onboardingDate && <p className="text-sm text-red-500 mt-1">{errors.onboardingDate}</p>}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="fileData">Upload Documents</Label>
            <div
              ref={dropZoneRef}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`mt-1 p-5 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed rounded-md cursor-pointer transition ${dragActive ? "border-gray-600 bg-gray-50" : "border-gray-300 hover:border-gray-500"}`}
              onClick={() => fileInputRef.current.click()}
            >
              <UploadCloud className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-600">Drag & drop files here or click to upload</p>
              <Input
                type="file"
                name="fileData"
                id="fileData"
                ref={fileInputRef}
                multiple
                onChange={handleChange}
                className="hidden"
              />
              {Array.isArray(formData.fileData) && formData.fileData.length > 0 && (
                <div className="mt-4 w-full flex flex-col gap-2">
                  {formData.fileData.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-2 rounded border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2 truncate text-sm text-gray-700">
                        {getFileIcon(file.type)} <span className="truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" className="text-red-500 hover:text-red-700 px-2 py-0" onClick={() => dispatch(removeFile(idx))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.fileData && <p className="text-sm text-red-500 mt-1">{errors.fileData}</p>}
          </div>

          <div className="sm:col-span-2 flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg"
              disabled={addLoading || industriesLoading}
            >
              {addLoading ? "Submitting..." : "Onboard Client"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



