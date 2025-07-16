// components/modals/TeamMeetingMOMDetails.js
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoMByMeetingId,
  resetMoMByMeetingId,
  createMoM,
  updateMoM,
  fetchMoMView,
} from "@/features/momSlice";
import { submitCause } from "@/features/causeSlice";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { format, isAfter, addHours } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText, Signature, User, Edit2, AlertCircle, Image } from "lucide-react";
import { toast } from "sonner";

function TeamMeetingMOMDetails({ isOpen, onClose, meeting }) {
  const dispatch = useDispatch();
  const { momByMeetingId, momByMeetingIdLoading, momView } = useSelector((state) => state.mom);
  const { currentUser } = useCurrentUser();
  const [mode, setMode] = useState("view");
  const [isEditMode, setIsEditMode] = useState(false);
  const [reasonForDelay, setReasonForDelay] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [momForm, setMomForm] = useState({ summary: "", notes: "", createdBy: "" });

  const checkMeetingTimeStatus = useCallback(() => {
    if (!meeting?.end?.dateTime) return false;
    const endTime = new Date(meeting.end.dateTime);
    const now = new Date();
    return isAfter(now, endTime);
  }, [meeting]);

  useEffect(() => {
    if (isOpen && meeting?.meetingId) {
      dispatch(fetchMoMByMeetingId(meeting.meetingId));
    }
  }, [isOpen, meeting?.meetingId, dispatch]);

  useEffect(() => {
    if (momByMeetingId) {
      setMode("view");
      setIsEditMode(false);
      setMomForm({
        summary: momByMeetingId.summary || "",
        notes: momByMeetingId.notes || "",
        createdBy: momByMeetingId.createdBy || currentUser?.name || "",
      });
    } else {
      setMode("form");
      setIsEditMode(false);
      setMomForm({ summary: "", notes: "", createdBy: currentUser?.name || "" });
    }
  }, [momByMeetingId, currentUser?.name]);

  useEffect(() => {
    return () => {
      dispatch(resetMoMByMeetingId());
    };
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!momForm.summary.trim()) return toast.info("Summary required");
    if (!signatureFile) return toast.info("Signature required");
    const formData = new FormData();
    formData.append("summary", momForm.summary);
    formData.append("notes", momForm.notes);
    formData.append("createdBy", momForm.createdBy);
    formData.append("meetingId", meeting.meetingId);
    formData.append("signature", signatureFile);
    if (checkMeetingTimeStatus()) {
      if (!reasonForDelay.trim() || !isAgreedToTerms) {
        return toast.info("Reason & agreement required after meeting ends");
      }
      formData.append("reasonForDelay", reasonForDelay);
      await dispatch(submitCause({ meetingId: meeting.meetingId, reason: reasonForDelay })).unwrap();
    }
    if (isEditMode) {
      await dispatch(updateMoM(formData)).unwrap();
    } else {
      await dispatch(createMoM(formData)).unwrap();
    }
    toast.success("MoM saved");
    setMode("view");
    setIsEditMode(false);
  };

  const isTimeExceeded = checkMeetingTimeStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <FileText className="h-5 w-5" />
            {mode === "form" ? (isEditMode ? "Edit MoM" : "Create MoM") : "Meeting MoM Details"}
          </DialogTitle>
        </DialogHeader>

        {momByMeetingIdLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : mode === "form" ? (
          <div className="space-y-4">
            <div>
              <Label>Summary</Label>
              <Textarea value={momForm.summary} onChange={(e) => setMomForm({ ...momForm, summary: e.target.value })} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={momForm.notes} onChange={(e) => setMomForm({ ...momForm, notes: e.target.value })} />
            </div>
            <div>
              <Label>Created By</Label>
              <Input value={momForm.createdBy} onChange={(e) => setMomForm({ ...momForm, createdBy: e.target.value })} />
            </div>
            <div>
              <Label>Signature</Label>
              <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSignatureFile(file);
                  setSignaturePreview(URL.createObjectURL(file));
                }
              }} />
              {signaturePreview && (
                <div className="mt-2">
                  <Image src={signaturePreview} alt="Signature" className="w-32 h-auto border rounded" />
                </div>
              )}
            </div>
            {isTimeExceeded && (
              <>
                <div>
                  <Label>Reason for Delay</Label>
                  <Textarea value={reasonForDelay} onChange={(e) => setReasonForDelay(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" checked={isAgreedToTerms} onCheckedChange={setIsAgreedToTerms} />
                  <Label htmlFor="terms">I agree to the cause terms</Label>
                </div>
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMode("view")}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!momForm.summary || !signatureFile}>Submit</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {momView?.pdfUrl ? (
              <iframe src={momView.pdfUrl} className="w-full h-96 rounded" title="MoM PDF Preview" />
            ) : (
              <p className="text-gray-500">No MoM available.</p>
            )}
            {momByMeetingId && (
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => { setMode("form"); setIsEditMode(true); }}>
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TeamMeetingMOMDetails;
