
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { validateInput, sanitizeInput } from "@/utils/sanitize";
// import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
// import ClientSelect from "@/modules/project/ClientSelect";
// import gsap from "gsap";
// import { toast } from "sonner";
// import {
//   FiCalendar,
//   FiUser,
//   FiFileText,
//   FiSave,
//   FiUpload,
//   FiX,
//   FiFolder,
//   FiFile,
//   FiImage,
//   FiVideo,
//   FiMusic,
//   FiBook,
//   FiCheck,
//   FiArrowLeft,
// } from "react-icons/fi";
// import {
//   createProject,
//   fetchAllProjects,
//   resetProjectCreation,
// } from "@/features/projectSlice";

// export default function ProjectOnboarding() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { loading, error, successMessage } = useSelector((state) => ({
//     loading: state.project.projectCreationLoading,
//     error: state.project.error.projectCreation,
//     successMessage: state.project.successMessage,
//   }));

//   const formRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const clientSelectRef = useRef(null);
//   const teamLeadSelectRef = useRef(null);
//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     clientId: "",
//     teamLeadId: "",
//     teamLeadName: "",
//     startDate: "",
//     endDate: "",
//     category: "",
//     attachments: [],
//   });
//   const [formErrors, setFormErrors] = useState({
//     projectName: "",
//     description: "",
//     clientId: "",
//     teamLeadId: "",
//     startDate: "",
//     endDate: "",
//     category: "",
//   });
//   const [fileErrors, setFileErrors] = useState([]);
//   const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
//   const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

//   // Toast notifications for success and error
//   useEffect(() => {
//     if (successMessage && !hasHandledSuccess) {
//       setHasHandledSuccess(true);
//       toast.success(successMessage || "Project created successfully!");
//       dispatch(fetchAllProjects());
//       router.push("/project");
//       dispatch(resetProjectCreation());
//     }
//     if (error) {
//       toast.error(error || "Failed to create project!");
//       gsap.to(formRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         ease: "power4.out",
//       });
//       dispatch(resetProjectCreation());
//     }
//   }, [successMessage, error, router, dispatch, hasHandledSuccess]);

//   // Form animation on mount
//   useEffect(() => {
//     gsap.fromTo(
//       formRef.current,
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
//     );
//   }, []);

//   // Click outside handler for select dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (clientSelectRef.current && !clientSelectRef.current.contains(event.target)) {
//         setIsClientSelectOpen(false);
//       }
//       if (teamLeadSelectRef.current && !teamLeadSelectRef.current.contains(event.target)) {
//         setIsTeamLeadSelectOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const validation = validateInput(value);

//     if (!validation.isValid) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: validation.warning,
//       }));
//       return;
//     }

//     setFormErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));

//     const sanitizedValue = sanitizeInput(value);
//     const updatedFormData = {
//       ...formData,
//       [name]: sanitizedValue,
//     };

//     // Reset clientId when category changes to in house
//     if (name === "category" && sanitizedValue === "in house") {
//       updatedFormData.clientId = "";
//       setFormErrors((prev) => ({
//         ...prev,
//         clientId: "",
//       }));
//     }

//     if (name === "startDate" && updatedFormData.endDate && new Date(sanitizedValue) > new Date(updatedFormData.endDate)) {
//       setFormErrors((prev) => ({
//         ...prev,
//         startDate: "Start date cannot be after end date",
//       }));
//     } else if (name === "endDate" && updatedFormData.startDate && new Date(updatedFormData.startDate) > new Date(sanitizedValue)) {
//       setFormErrors((prev) => ({
//         ...prev,
//         endDate: "End date cannot be before start date",
//       }));
//     }

//     setFormData(updatedFormData);
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   const handleFiles = (files) => {
//     const newFiles = Array.from(files);
//     const validFiles = [];
//     const errors = [];

//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-powerpoint",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       "text/plain",
//       "image/jpeg",
//       "image/png",
//       "image/gif",
//       "video/mp4",
//       "video/mov",
//       "video/avi",
//       "audio/mpeg",
//       "audio/wav",
//     ];

//     const maxSize = 10 * 1024 * 1024; // 10MB

//     newFiles.forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         errors.push(`File ${file.name} has an unsupported type.`);
//       } else if (file.size > maxSize) {
//         errors.push(`File ${file.name} exceeds 10MB.`);
//       } else {
//         validFiles.push(file);
//       }
//     });

//     if (errors.length > 0) {
//       setFileErrors(errors);
//       toast.error(errors.join(" "));
//     }

//     if (validFiles.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [...prev.attachments, ...validFiles],
//       }));

//       gsap.from(".file-item:last-child", {
//         opacity: 0,
//         x: -30,
//         duration: 0.5,
//         ease: "power4.out",
//       });
//     }
//   };

//   const removeFile = (index) => {
//     const fileElement = document.querySelector(`.file-item:nth-child(${index + 1})`);
//     gsap.to(fileElement, {
//       opacity: 0,
//       x: 30,
//       duration: 0.5,
//       ease: "power4.in",
//       onComplete: () => {
//         setFormData((prev) => ({
//           ...prev,
//           attachments: prev.attachments.filter((_, i) => i !== index),
//         }));
//       },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let hasErrors = false;
//     const newErrors = { ...formErrors };

//     for (const [key, value] of Object.entries(formData)) {
//       if (key === "attachments" || key === "teamLeadName") continue;
//       if (key === "clientId" && formData.category === "in house") continue; // Skip clientId validation for in house
//       const validation = validateInput(value);
//       if (!validation.isValid) {
//         newErrors[key] = validation.warning;
//         hasErrors = true;
//       }
//     }

//     if (formData.startDate && formData.endDate) {
//       if (new Date(formData.startDate) > new Date(formData.endDate)) {
//         newErrors.startDate = "Start date cannot be after end date";
//         newErrors.endDate = "End date cannot be before start date";
//         hasErrors = true;
//       }
//     }

//     if (hasErrors) {
//       setFormErrors(newErrors);
//       toast.error("Please fix the errors in the form before submitting.");
//       return;
//     }

//     const submissionData = new FormData();
//     submissionData.append("projectName", formData.projectName);
//     submissionData.append("description", formData.description);
//     if (formData.category === "client") {
//       submissionData.append("clientId", formData.clientId);
//     }
//     submissionData.append("teamLeadId", formData.teamLeadId);
//     submissionData.append("teamLeadName", formData.teamLeadName);
//     submissionData.append("startDate", formData.startDate);
//     submissionData.append("endDate", formData.endDate);
//     submissionData.append("category", formData.category);
//     formData.attachments.forEach((file) => {
//       submissionData.append("attachments[]", file);
//     });

//     await gsap.to(formRef.current, {
//       opacity: 0,
//       y: -30,
//       duration: 0.5,
//       ease: "power4.in",
//     });

//     try {
//       await dispatch(createProject(submissionData)).unwrap();
//     } catch (err) {
//       toast.error(`Failed to create project: ${err.message || "Unknown error"}`);
//       gsap.to(formRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         ease: "power4.out",
//       });
//     }
//   };

//   const getFileIcon = (file) => {
//     const fileName = file.name || "unknown";
//     const extension = fileName.split(".").pop().toLowerCase();
//     switch (extension) {
//       case "pdf":
//         return <FiBook className="text-red-500" aria-hidden="true" />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FiImage className="text-green-500" aria-hidden="true" />;
//       case "mp4":
//       case "mov":
//       case "avi":
//         return <FiVideo className="text-blue-500" aria-hidden="true" />;
//       case "mp3":
//       case "wav":
//         return <FiMusic className="text-purple-500" aria-hidden="true" />;
//       case "doc":
//       case "docx":
//       case "txt":
//         return <FiFile className="text-indigo-500" aria-hidden="true" />;
//       default:
//         return <FiFile className="text-gray-500" aria-hidden="true" />;
//     }
//   };

//   return (
//     <div
//       ref={formRef}
//       className="container mx-auto px-4 py-6 bg-white rounded-lg shadow-sm transform transition-all duration-300 min-h-screen min-w-full overflow-y-auto"
//     >
//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={() => router.back()}

//           className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full font-medium text-sm transition-all hover:bg-blue-100"
//           aria-label="Back to projects"
//         >
//           <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
//           <span className="hidden sm:inline">Back</span>
//         </button>
//         <h1 className="text-xl font-semibold text-gray-800 text-center">
//           Onboard New Project
//         </h1>
//       </div>

//       <form
//         id="project-form"
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <div className="space-y-4">
//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.projectName ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiFileText className="mr-2" aria-hidden="true" />
//               Project Name
//               {formErrors.projectName && <span className="ml-2 text-xs font-normal">({formErrors.projectName})</span>}
//             </label>
//             <input
//               type="text"
//               name="projectName"
//               value={formData.projectName}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className={`w-full p-2 border ${formErrors.projectName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.projectName ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               placeholder="Enter project name"
//               aria-label="Project name"
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.category ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiFolder className="mr-2" aria-hidden="true" />
//               Category
//               {formErrors.category && <span className="ml-2 text-xs font-normal">({formErrors.category})</span>}
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className={`w-full p-2 cursor-pointer border ${formErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.category ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               aria-label="Project category"
//             >
//               <option value="">Select Category</option>
//               <option value="client">Client</option>
//               <option value="in house">In House</option>
//             </select>
//           </div>

//           {formData.category === "client" && (
//             <div ref={clientSelectRef} className="p-4 border border-gray-200 rounded-lg">
//               <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.clientId ? 'text-red-500' : 'text-gray-600'}`}>
//                 <FiUser className="mr-2" aria-hidden="true" />
//                 Client
//                 {formErrors.clientId && <span className="ml-2 text-xs font-normal">({formErrors.clientId})</span>}
//               </label>
//               <ClientSelect
//                 value={formData.clientId}
//                 isOpen={isClientSelectOpen}
//                 onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
//                 onChange={(value) => {
//                   setFormData((prev) => ({ ...prev, clientId: value }));
//                   setIsClientSelectOpen(false);
//                   setFormErrors((prev) => ({ ...prev, clientId: "" }));
//                 }}
//                 disabled={loading}
//               />
//             </div>
//           )}

//           <div ref={teamLeadSelectRef} className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.teamLeadId ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiUser className="mr-2" aria-hidden="true" />
//               Team Lead
//               {formErrors.teamLeadId && <span className="ml-2 text-xs font-normal">({formErrors.teamLeadId})</span>}
//             </label>
//             <TeamLeadSelect
//               value={formData.teamLeadId}
//               isOpen={isTeamLeadSelectOpen}
//               onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
//               onChange={({ teamLeadId, teamLeadName }) => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   teamLeadId,
//                   teamLeadName,
//                 }));
//                 setIsTeamLeadSelectOpen(false);
//                 setFormErrors((prev) => ({ ...prev, teamLeadId: "" }));
//               }}
//               disabled={loading}
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.startDate ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiCalendar className="mr-2" aria-hidden="true" />
//               Start Date
//               {formErrors.startDate && <span className="ml-2 text-xs font-normal">({formErrors.startDate})</span>}
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className={`w-full cursor-pointer p-2 border ${formErrors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.startDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               aria-label="Start date"
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.endDate ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiCalendar className="mr-2" aria-hidden="true" />
//               End Date
//               {formErrors.endDate && <span className="ml-2 text-xs font-normal">({formErrors.endDate})</span>}
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className={`w-full cursor-pointer p-2 border ${formErrors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.endDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               aria-label="End date"
//             />
//           </div>

//           <div
//             className={`p-4 border ${dragActive ? "border-gray-400 bg-gray-50" : "border-gray-200 bg-white"} rounded-lg transition-colors duration-200`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             onClick={() => !loading && fileInputRef.current?.click()}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               onChange={(e) => handleFiles(e.target.files)}
//               className="hidden"
//               disabled={loading}
//               accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,audio/mpeg,audio/wav"
//               aria-label="Upload files"
//             />
//             <div className="text-center mb-2">
//               <FiUpload className="mx-auto text-xl text-gray-500 mb-1" aria-hidden="true" />
//               <p className="text-gray-500 text-sm">
//                 Drag & drop files or click to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, MP4, MOV, AVI, MP3, WAV)
//               </p>
//             </div>
//             {formData.attachments.length > 0 && (
//               <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
//                 {formData.attachments.map((file, index) => {
//                   const fileName = file.name;
//                   const extension = fileName.split(".").pop().toLowerCase();
//                   const truncatedName = fileName.substring(0, Math.min(8, fileName.length - extension.length - 1));
//                   const displayName = `${truncatedName}...${extension}`;

//                   return (
//                     <div
//                       key={`attachment-${index}`}
//                       className="file-item relative group flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-all duration-200"
//                     >
//                       <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           type="button"
//                           onClick={() => removeFile(index)}
//                           className="text-gray-400 hover:text-red-400 p-1"
//                           disabled={loading}
//                           aria-label={`Remove ${fileName}`}
//                         >
//                           <FiX size={16} />
//                         </button>
//                       </div>
//                       <div className="flex flex-col items-center gap-2">
//                         <div className="text-2xl">{getFileIcon(file)}</div>
//                         <span className="text-gray-600 text-xs text-center" title={fileName}>
//                           {displayName}
//                         </span>
//                       </div>
//                       <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full p-1">
//                         <FiCheck size={12} aria-hidden="true" />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="p-4 border border-gray-200 rounded-lg h-full">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.description ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiFileText className="mr-2" aria-hidden="true" />
//               Description
//               {formErrors.description && <span className="ml-2 text-xs font-normal">({formErrors.description})</span>}
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className={`w-full h-[calc(100%-32px)] resize-none p-2 border ${formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.description ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               placeholder="Describe your project..."
//               aria-label="Project description"
//             />
//           </div>
//         </div>
//       </form>

//       <div className="flex justify-end mt-6">
//         <button
//           type="submit"
//           form="project-form"
//           disabled={loading}
//           className={`flex items-center gap-2 rounded-full py-2 px-4 text-white transition-colors duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
//           aria-label="Create project"
//         >
//           {loading ? (
//             <>
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                 ></path>
//               </svg>
//               Creating...
//             </>
//           ) : (
//             <>
//               <FiSave aria-hidden="true" />
//               Create Project
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { validateInput, sanitizeInput } from "@/utils/sanitize";
import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
import ClientSelect from "@/modules/project/ClientSelect";
import { toast } from "sonner";
import {
  FiCalendar,
  FiUser,
  FiFileText,
  FiSave,
  FiUpload,
  FiX,
  FiFolder,
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiBook,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import {
  createProject,
  fetchAllProjects,
  resetProjectCreation,
} from "@/features/projectSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ProjectOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => ({
    loading: state.project.status.projectCreation === "loading",
    error: state.project.error.projectCreation,
    successMessage: state.project.successMessage,
  }));

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const clientSelectRef = useRef(null);
  const teamLeadSelectRef = useRef(null);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientId: undefined,
    teamLeadId: "",
    teamLeadName: "",
    startDate: "",
    endDate: "",
    category: "",
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    startDate: "",
    endDate: "",
    category: "",
  });
  const [fileErrors, setFileErrors] = useState([]);
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  // Handle success and error toasts
  useEffect(() => {
    if (successMessage && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      toast.success(successMessage || "Project created successfully!");
      dispatch(fetchAllProjects());
      router.push("/project");
      dispatch(resetProjectCreation());
    }
    if (error) {
      toast.error(error || "Failed to create project!");
      dispatch(resetProjectCreation());
    }
  }, [successMessage, error, router, dispatch, hasHandledSuccess]);

  // Click outside handler for select dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clientSelectRef.current &&
        !clientSelectRef.current.contains(event.target)
      ) {
        setIsClientSelectOpen(false);
      }
      if (
        teamLeadSelectRef.current &&
        !teamLeadSelectRef.current.contains(event.target)
      ) {
        setIsTeamLeadSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);

    if (!validation.isValid) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: validation.warning,
      }));
      return;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    const sanitizedValue = sanitizeInput(value);
    const updatedFormData = {
      ...formData,
      [name]: sanitizedValue,
    };

    // Reset clientId when category changes to in house
    if (name === "category" && sanitizedValue === "in house") {
      updatedFormData.clientId = undefined;
      setFormErrors((prev) => ({
        ...prev,
        clientId: "",
      }));
    }

    if (
      name === "startDate" &&
      updatedFormData.endDate &&
      new Date(sanitizedValue) > new Date(updatedFormData.endDate)
    ) {
      setFormErrors((prev) => ({
        ...prev,
        startDate: "Start date cannot be after end date",
      }));
    } else if (
      name === "endDate" &&
      updatedFormData.startDate &&
      new Date(updatedFormData.startDate) > new Date(sanitizedValue)
    ) {
      setFormErrors((prev) => ({
        ...prev,
        endDate: "End date cannot be before start date",
      }));
    }

    setFormData(updatedFormData);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/mov",
      "video/avi",
      "audio/mpeg",
      "audio/wav",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    newFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File ${file.name} has an unsupported type.`);
      } else if (file.size > maxSize) {
        errors.push(`File ${file.name} exceeds 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      toast.error(errors.join(" "));
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }));
      setFileErrors([]);
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { ...formErrors };

    for (const [key, value] of Object.entries(formData)) {
      if (key === "attachments" || key === "teamLeadName") continue;
      if (key === "clientId" && formData.category === "in house") continue;
      const validation = validateInput(value);
      if (!validation.isValid) {
        newErrors[key] = validation.warning;
        hasErrors = true;
      }
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.startDate = "Start date cannot be after end date";
        newErrors.endDate = "End date cannot be before start date";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors(newErrors);
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("projectName", formData.projectName);
    submissionData.append("description", formData.description);
    if (formData.category === "client") {
      submissionData.append("clientId", formData.clientId);
    }
    submissionData.append("teamLeadId", formData.teamLeadId);
    submissionData.append("teamLeadName", formData.teamLeadName);
    submissionData.append("startDate", formData.startDate);
    submissionData.append("endDate", formData.endDate);
    submissionData.append("category", formData.category);

    // Append attachments as an array under a single key
    formData.attachments.forEach((file) => {
      submissionData.append("attachments", file); // Use 'attachments' key
      // If backend expects 'attachments[]', use:
      // submissionData.append("attachments[]", file);
    });

    if (process.env.NODE_ENV === "development") {
      console.log("FormData contents:");
      for (let [key, value] of submissionData.entries()) {
        console.log(`${key}: ${value instanceof File ? `${value.name} (${value.size} bytes)` : value}`);
      }
    }

    try {
      await dispatch(createProject(submissionData)).unwrap();
    } catch (err) {
      console.error("Project creation error:", err);
      toast.error(`Failed to create project: ${err.message || "Unknown error"}`);
    }
  };

  const getFileIcon = (file) => {
    const fileName = file.name || "unknown";
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiBook className="text-red-500" aria-hidden="true" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FiImage className="text-green-500" aria-hidden="true" />;
      case "mp4":
      case "mov":
      case "avi":
        return <FiVideo className="text-blue-500" aria-hidden="true" />;
      case "mp3":
      case "wav":
        return <FiMusic className="text-purple-500" aria-hidden="true" />;
      case "doc":
      case "docx":
      case "txt":
        return <FiFile className="text-indigo-500" aria-hidden="true" />;
      default:
        return <FiFile className="text-gray-500" aria-hidden="true" />;
    }
  };

  return (
    <Card
      ref={formRef}
      className="mx-auto max-w-7xl p-6 transition-opacity duration-500 min-h-screen"
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            aria-label="Back to projects"
          >
            <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <CardTitle className="text-xl text-center">
            Onboard New Project
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form
          id="project-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="projectName"
                className={formErrors.projectName ? "text-red-500" : ""}
              >
                <div className="flex items-center gap-2">
                  <FiFileText aria-hidden="true" />
                  Project Name
                  {formErrors.projectName && (
                    <span className="text-xs">({formErrors.projectName})</span>
                  )}
                </div>
              </Label>
              <Input
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter project name"
                className={formErrors.projectName ? "border-red-300" : ""}
                aria-label="Project name"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className={formErrors.category ? "text-red-500" : ""}
              >
                <div className="flex items-center gap-2">
                  <FiFolder aria-hidden="true" />
                  Category
                  {formErrors.category && (
                    <span className="text-xs">({formErrors.category})</span>
                  )}
                </div>
              </Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) =>
                  handleChange({ target: { name: "category", value } })
                }
                disabled={loading}
              >
                <SelectTrigger
                  className={formErrors.category ? "border-red-300" : ""}
                  aria-label="Project category"
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="in house">In House</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.category === "client" && (
              <div ref={clientSelectRef} className="space-y-2">
                <Label
                  htmlFor="clientId"
                  className={formErrors.clientId ? "text-red-500" : ""}
                >
                  <div className="flex items-center gap-2">
                    <FiUser aria-hidden="true" />
                    Client
                    {formErrors.clientId && (
                      <span className="text-xs">({formErrors.clientId})</span>
                    )}
                  </div>
                </Label>
                <ClientSelect
                  value={formData.clientId}
                  isOpen={isClientSelectOpen}
                  onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, clientId: value }));
                    setIsClientSelectOpen(false);
                    setFormErrors((prev) => ({ ...prev, clientId: "" }));
                  }}
                  disabled={loading}
                />
              </div>
            )}

            <div ref={teamLeadSelectRef} className="space-y-2">
              <Label
                htmlFor="teamLeadId"
                className={formErrors.teamLeadId ? "text-red-500" : ""}
              >
                <div className="flex items-center gap-2">
                  <FiUser aria-hidden="true" />
                  Team Lead
                  {formErrors.teamLeadId && (
                    <span className="text-xs">({formErrors.teamLeadId})</span>
                  )}
                </div>
              </Label>
              <TeamLeadSelect
                value={formData.teamLeadId}
                isOpen={isTeamLeadSelectOpen}
                onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
                onChange={({ teamLeadId, teamLeadName }) => {
                  setFormData((prev) => ({
                    ...prev,
                    teamLeadId,
                    teamLeadName,
                  }));
                  setIsTeamLeadSelectOpen(false);
                  setFormErrors((prev) => ({ ...prev, teamLeadId: "" }));
                }}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className={formErrors.startDate ? "text-red-500" : ""}
              >
                <div className="flex items-center gap-2">
                  <FiCalendar aria-hidden="true" />
                  Start Date
                  {formErrors.startDate && (
                    <span className="text-xs">({formErrors.startDate})</span>
                  )}
                </div>
              </Label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
                className={formErrors.startDate ? "border-red-300" : ""}
                aria-label="Start date"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className={formErrors.endDate ? "text-red-500" : ""}
              >
                <div className="flex items-center gap-2">
                  <FiCalendar aria-hidden="true" />
                  End Date
                  {formErrors.endDate && (
                    <span className="text-xs">({formErrors.endDate})</span>
                  )}
                </div>
              </Label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                disabled={loading}
                className={formErrors.endDate ? "border-red-300" : ""}
                aria-label="End date"
              />
            </div>

            <div
              className={`p-4 border rounded-md transition-colors duration-200 ${
                dragActive ? "border-gray-400 bg-gray-50" : "border-gray-200"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                disabled={loading}
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,audio/mpeg,audio/wav"
                aria-label="Upload files"
              />
              <div className="text-center space-y-2">
                <FiUpload className="mx-auto text-xl text-gray-500" aria-hidden="true" />
                <p className="text-sm text-gray-500">
                  Drag & drop files or click to upload (PDF, DOC, DOCX, XLS,
                  XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, MP4, MOV, AVI, MP3, WAV)
                </p>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
                  {formData.attachments.map((file, index) => {
                    const fileName = file.name;
                    const extension = fileName.split(".").pop().toLowerCase();
                    const truncatedName = fileName.substring(
                      0,
                      Math.min(8, fileName.length - extension.length - 1)
                    );
                    const displayName = `${truncatedName}...${extension}`;

                    return (
                      <div
                        key={`attachment-${index}`}
                        className="relative group flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md text-sm hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={loading}
                            aria-label={`Remove ${fileName}`}
                          >
                            <FiX size={16} />
                          </Button>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-2xl">{getFileIcon(file)}</div>
                          <span
                            className="text-gray-600 text-xs text-center"
                            title={fileName}
                          >
                            {displayName}
                          </span>
                        </div>
                        <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full p-1">
                          <FiCheck size={12} aria-hidden="true" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className={formErrors.description ? "text-red-500" : ""}
            >
              <div className="flex items-center gap-2">
                <FiFileText aria-hidden="true" />
                Description
                {formErrors.description && (
                  <span className="text-xs">({formErrors.description})</span>
                )}
              </div>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className={`min-h-[calc(100%-2rem)] ${
                formErrors.description ? "border-red-300" : ""
              }`}
              placeholder="Describe your project..."
              aria-label="Project description"
            />
          </div>
        </form>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            form="project-form"
            disabled={loading}
            className="flex items-center gap-2"
            aria-label="Create project"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FiSave aria-hidden="true" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
