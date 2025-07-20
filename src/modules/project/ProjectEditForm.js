


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { validateInput, sanitizeInput } from '@/utils/sanitize';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { fetchProjectById, updateProject } from '@/features/projectSlice';
// import {
//   FiCalendar,
//   FiUser,
//   FiFileText,
//   FiSave,
//   FiUpload,
//   FiX,
//   FiFolder,
//   FiFile,
//   FiBook,
//   FiCheck,
//   FiArrowLeft,
// } from 'react-icons/fi';
// import { toast } from 'sonner';
// import TeamLeadSelect from '@/modules/project/TeamLeadSelect';
// import ClientSelect from '@/modules/project/ClientSelect';
// import gsap from 'gsap';

// export default function ProjectEditForm({ projectId }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { project, status, error } = useSelector((state) => state.project);

//   const formRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const teamLeadSelectRef = useRef(null);
//   const clientSelectRef = useRef(null);

//   const [formData, setFormData] = useState({
//     projectName: '',
//     description: '',
//     clientId: '',
//     teamLeadId: '',
//     teamLeadName: '',
//     startDate: '',
//     endDate: '',
//     category: '',
//     attachments: [],
//   });

//   const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
//   const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [fileErrors, setFileErrors] = useState([]);
//   const [isFormInitialized, setIsFormInitialized] = useState(false);

//   // Fetch project data on component mount
//   useEffect(() => {
//     if (projectId && status.fetchProject === 'idle') {
//       dispatch(fetchProjectById(projectId));
//     }
//   }, [dispatch, projectId, status.fetchProject]);

//   // Animate form appearance
//   useEffect(() => {
//     gsap.fromTo(
//       formRef.current,
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
//     );
//   }, []);

//   // Update form data when project data is fetched, only if not initialized
//   useEffect(() => {
//     if (project && project.data && !isFormInitialized && status.fetchProject === 'succeeded') {
//       setFormData({
//         projectName: project.data.projectName || '',
//         description: project.data.description || '',
//         clientId: project.data.clientId || '',
//         teamLeadId: project.data.teamLeadId || '',
//         teamLeadName: project.data.teamLeadName || '',
//         startDate: project.data.startDate ? project.data.startDate.split('T')[0] : '',
//         endDate: project.data.endDate ? project.data.endDate.split('T')[0] : '',
//         category: project.data.category || '',
//         attachments: [],
//       });
//       setIsFormInitialized(true);
//     }
//   }, [project, status.fetchProject, isFormInitialized]);

//   // Click outside handler for select dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (teamLeadSelectRef.current && !teamLeadSelectRef.current.contains(event.target)) {
//         setIsTeamLeadSelectOpen(false);
//       }
//       if (clientSelectRef.current && !clientSelectRef.current.contains(event.target)) {
//         setIsClientSelectOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const [formErrors, setFormErrors] = useState({
//     projectName: '',
//     description: '',
//     clientId: '',
//     teamLeadId: '',
//     teamLeadName: '',
//     startDate: '',
//     endDate: '',
//     category: '',
//   });

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
//       [name]: '',
//     }));

//     const sanitizedValue = sanitizeInput(value);
//     const updatedFormData = {
//       ...formData,
//       [name]: sanitizedValue,
//     };

//     // Reset clientId when category changes to in house
//     if (name === 'category' && sanitizedValue === 'in house') {
//       updatedFormData.clientId = '';
//       setFormErrors((prev) => ({
//         ...prev,
//         clientId: '',
//       }));
//     }

//     if (name === 'startDate' && updatedFormData.endDate && new Date(sanitizedValue) > new Date(updatedFormData.endDate)) {
//       setFormErrors((prev) => ({
//         ...prev,
//         startDate: 'Start date cannot be after end date',
//       }));
//     } else if (name === 'endDate' && updatedFormData.startDate && new Date(updatedFormData.startDate) > new Date(sanitizedValue)) {
//       setFormErrors((prev) => ({
//         ...prev,
//         endDate: 'End date cannot be before start date',
//       }));
//     }

//     setFormData(updatedFormData);
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
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
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/vnd.ms-powerpoint',
//       'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//       'text/plain',
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
//       toast.error(errors.join(' '));
//     }

//     if (validFiles.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [...prev.attachments, ...validFiles],
//       }));

//       gsap.from('.file-item:last-child', {
//         opacity: 0,
//         x: -30,
//         duration: 0.5,
//         ease: 'power4.out',
//       });
//     }
//   };

//   const removeFile = (index) => {
//     const fileElement = document.querySelector(`.file-item:nth-child(${index + 1})`);
//     gsap.to(fileElement, {
//       opacity: 0,
//       x: 30,
//       duration: 0.5,
//       ease: 'power4.in',
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
//       if (key === 'attachments' || key === 'teamLeadName') continue;
//       if (key === 'clientId' && formData.category === 'in house') continue;
//       const validation = validateInput(value);
//       if (!validation.isValid) {
//         newErrors[key] = validation.warning;
//         hasErrors = true;
//       }
//     }

//     if (formData.startDate && formData.endDate) {
//       if (new Date(formData.startDate) > new Date(formData.endDate)) {
//         newErrors.startDate = 'Start date cannot be after end date';
//         newErrors.endDate = 'End date cannot be before start date';
//         hasErrors = true;
//       }
//     }

//     if (hasErrors) {
//       setFormErrors(newErrors);
//       toast.error('Please fix the errors in the form before submitting.');
//       return;
//     }

//     try {
//       const submissionData = new FormData();
//       submissionData.append('projectName', formData.projectName);
//       submissionData.append('description', formData.description);
//       if (formData.category === 'client') {
//         submissionData.append('clientId', formData.clientId);
//       }
//       submissionData.append('teamLeadId', formData.teamLeadId);
//       submissionData.append('teamLeadName', formData.teamLeadName);
//       submissionData.append('startDate', formData.startDate);
//       submissionData.append('endDate', formData.endDate);
//       submissionData.append('category', formData.category);

//       formData.attachments.forEach((file) => {
//         submissionData.append('attachments[]', file);
//       });

//       await gsap.to(formRef.current, {
//         opacity: 0,
//         y: -30,
//         duration: 0.5,
//         ease: 'power4.in',
//       });

//       await dispatch(updateProject({ projectId, updatedData: submissionData })).unwrap();

//       toast.success('Project updated successfully!');
//       router.push('/project');
//     } catch (err) {
//       toast.error(`Failed to update project: ${err.message || 'Unknown error'}`);
//       gsap.to(formRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         ease: 'power4.out',
//       });
//     }
//   };

//   const getFileIcon = (file) => {
//     const fileName = file.name || 'unknown';
//     const extension = fileName.split('.').pop().toLowerCase();
//     switch (extension) {
//       case 'pdf':
//         return <FiBook className="text-red-500" />;
//       case 'doc':
//       case 'docx':
//         return <FiFile className="text-blue-500" />;
//       case 'xls':
//       case 'xlsx':
//         return <FiFile className="text-green-500" />;
//       case 'ppt':
//       case 'pptx':
//         return <FiFile className="text-orange-500" />;
//       case 'txt':
//         return <FiFile className="text-gray-500" />;
//       default:
//         return <FiFile className="text-gray-500" />;
//     }
//   };

//   if (status.fetchProject === 'loading') {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-t-3 border-blue-600 mb-4"></div>
//         <p className="text-gray-600 font-medium text-sm sm:text-base">Loading project details...</p>
//       </div>
//     );
//   }

//   if (status.fetchProject === 'failed') {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-5 rounded-lg max-w-md w-full">
//           <p className="font-semibold text-base sm:text-lg mb-2">Unable to load project</p>
//           <p className="text-red-600 text-sm sm:text-base">{error.fetchProject || 'An error occurred'}</p>
//           <button
//             onClick={() => dispatch(fetchProjectById(projectId))}
//             className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 mx-auto transition-colors"
//             aria-label="Retry loading project"
//           >
//             <FiArrowLeft className="h-4 w-4" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={formRef}
//       className="container mx-auto px-4 py-6 bg-white rounded-lg shadow-sm transform transition-all duration-300 min-h-screen min-w-full overflow-y-auto"
//     >
//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={() => router.push('/project')}
//           className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full font-medium text-sm transition-all hover:bg-blue-100"
//           aria-label="Back to projects"
//         >
//           <FiArrowLeft className="h-5 w-5" />
//           <span className="hidden sm:inline">Back</span>
//         </button>
//         <h1 className="text-xl font-semibold text-gray-800 text-center">
//           Edit Project
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
//               <FiFileText className="mr-2" />
//               Project Name
//               {formErrors.projectName && <span className="ml-2 text-xs font-normal">({formErrors.projectName})</span>}
//             </label>
//             <input
//               type="text"
//               name="projectName"
//               value={formData.projectName}
//               onChange={handleChange}
//               required
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//               className={`w-full p-2 border ${formErrors.projectName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.projectName ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               placeholder="Enter project name"
//               aria-label="Project name"
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.category ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiFolder className="mr-2" />
//               Category
//               {formErrors.category && <span className="ml-2 text-xs font-normal">({formErrors.category})</span>}
//             </label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
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
//                 <FiUser className="mr-2" />
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
//                   setFormErrors((prev) => ({ ...prev, clientId: '' }));
//                 }}
//                 disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//               />
//             </div>
//           )}

//           <div ref={teamLeadSelectRef} className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.teamLeadId ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiUser className="mr-2" />
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
//               }}
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.startDate ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiCalendar className="mr-2" />
//               Start Date
//               {formErrors.startDate && <span className="ml-2 text-xs font-normal">({formErrors.startDate})</span>}
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               required
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//               className={`w-full cursor-pointer p-2 border ${formErrors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.startDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               aria-label="Start date"
//             />
//           </div>

//           <div className="p-4 border border-gray-200 rounded-lg">
//             <label className={`flex items-center text-sm font-medium mb-1 ${formErrors.endDate ? 'text-red-500' : 'text-gray-600'}`}>
//               <FiCalendar className="mr-2" />
//               End Date
//               {formErrors.endDate && <span className="ml-2 text-xs font-normal">({formErrors.endDate})</span>}
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               required
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//               className={`w-full cursor-pointer p-2 border ${formErrors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} rounded-md focus:outline-none disabled:opacity-50 ${formErrors.endDate ? 'focus:border-red-400' : 'focus:border-gray-400'}`}
//               aria-label="End date"
//             />
//           </div>

//           <div
//             className={`p-4 border ${
//               dragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white'
//             } rounded-lg transition-colors duration-200`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             onClick={() => status.fetchProject !== 'loading' && status.updateProject !== 'loading' && fileInputRef.current?.click()}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               onChange={(e) => handleFiles(e.target.files)}
//               className="hidden"
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//               accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
//               aria-label="Upload files"
//             />
//             <div className="text-center mb-2">
//               <FiUpload className="mx-auto text-xl text-gray-500 mb-1" />
//               <p className="text-gray-500 text-sm">
//                 Drag & drop files or click to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT)
//               </p>
//             </div>
//             {formData.attachments.length > 0 && (
//               <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
//                 {formData.attachments.map((file, index) => {
//                   const fileName = file.name;
//                   const extension = fileName.split('.').pop().toLowerCase();
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
//                           disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
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
//                         <FiCheck size={12} />
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
//               <FiFileText className="mr-2" />
//               Description
//               {formErrors.description && <span className="ml-2 text-xs font-normal">({formErrors.description})</span>}
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
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
//           disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
//           className={`flex items-center gap-2 rounded-full py-2 px-4 text-white transition-colors duration-200 ${
//             status.fetchProject === 'loading' || status.updateProject === 'loading' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//           aria-label="Save changes"
//         >
//           {status.fetchProject === 'loading' || status.updateProject === 'loading' ? (
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
//               Saving...
//             </>
//           ) : (
//             <>
//               <FiSave />
//               Save Changes
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }




'use client';

import { useEffect, useState, useRef } from 'react';
import { validateInput, sanitizeInput } from '@/utils/sanitize';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchProjectById, updateProject } from '@/features/projectSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, File, FileText, Folder, Save, Upload, User, X, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import TeamLeadSelect from '@/modules/project/TeamLeadSelect';
import ClientSelect from '@/modules/project/ClientSelect';

export default function ProjectEditForm({ projectId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { project, status, error } = useSelector((state) => state.project);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const teamLeadSelectRef = useRef(null);
  const clientSelectRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    clientId: '',
    teamLeadId: '',
    teamLeadName: '',
    startDate: '',
    endDate: '',
    category: '',
    attachments: [], // New attachments to be uploaded
    existingAttachments: [], // Existing attachments from the server
    removedAttachments: [], // IDs of attachments to be removed
  });

  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Fetch project data on component mount
  useEffect(() => {
    if (projectId && status.fetchProject === 'idle') {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId, status.fetchProject]);

  // Update form data when project data is fetched
  useEffect(() => {
    if (project && project.data && !isFormInitialized && status.fetchProject === 'succeeded') {
      setFormData({
        projectName: project.data.projectName || '',
        description: project.data.description || '',
        clientId: project.data.clientId || '',
        teamLeadId: project.data.teamLeadId || '',
        teamLeadName: project.data.teamLeadName || '',
        startDate: project.data.startDate ? project.data.startDate.split('T')[0] : '',
        endDate: project.data.endDate ? project.data.endDate.split('T')[0] : '',
        category: project.data.category || '',
        attachments: [],
        existingAttachments: project.data.attachments || [], // Assuming attachments are included in the project data
        removedAttachments: [],
      });
      setIsFormInitialized(true);
    }
  }, [project, status.fetchProject, isFormInitialized]);

  // Click outside handler for select dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (teamLeadSelectRef.current && !teamLeadSelectRef.current.contains(event.target)) {
        setIsTeamLeadSelectOpen(false);
      }
      if (clientSelectRef.current && !clientSelectRef.current.contains(event.target)) {
        setIsClientSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [formErrors, setFormErrors] = useState({
    projectName: '',
    description: '',
    clientId: '',
    teamLeadId: '',
    teamLeadName: '',
    startDate: '',
    endDate: '',
    category: '',
  });

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
      [name]: '',
    }));

    const sanitizedValue = sanitizeInput(value);
    const updatedFormData = {
      ...formData,
      [name]: sanitizedValue,
    };

    if (name === 'category' && sanitizedValue === 'in house') {
      updatedFormData.clientId = '';
      setFormErrors((prev) => ({
        ...prev,
        clientId: '',
      }));
    }

    if (name === 'startDate' && updatedFormData.endDate && new Date(sanitizedValue) > new Date(updatedFormData.endDate)) {
      setFormErrors((prev) => ({
        ...prev,
        startDate: 'Start date cannot be after end date',
      }));
    } else if (name === 'endDate' && updatedFormData.startDate && new Date(updatedFormData.startDate) > new Date(sanitizedValue)) {
      setFormErrors((prev) => ({
        ...prev,
        endDate: 'End date cannot be before start date',
      }));
    }

    setFormData(updatedFormData);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
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
      toast.error(errors.join(' '));
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles],
      }));
    }
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const removeExistingAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingAttachments: prev.existingAttachments.filter((_, i) => i !== index),
      removedAttachments: [...prev.removedAttachments, prev.existingAttachments[index].id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { ...formErrors };

    for (const [key, value] of Object.entries(formData)) {
      if (key === 'attachments' || key === 'teamLeadName' || key === 'existingAttachments' || key === 'removedAttachments') continue;
      if (key === 'clientId' && formData.category === 'in house') continue;
      const validation = validateInput(value);
      if (!validation.isValid) {
        newErrors[key] = validation.warning;
        hasErrors = true;
      }
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.startDate = 'Start date cannot be after end date';
        newErrors.endDate = 'End date cannot be before start date';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors(newErrors);
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append('projectName', formData.projectName);
      submissionData.append('description', formData.description);
      if (formData.category === 'client') {
        submissionData.append('clientId', formData.clientId);
      }
      submissionData.append('teamLeadId', formData.teamLeadId);
      submissionData.append('teamLeadName', formData.teamLeadName);
      submissionData.append('startDate', formData.startDate);
      submissionData.append('endDate', formData.endDate);
      submissionData.append('category', formData.category);
      submissionData.append('removedAttachments', JSON.stringify(formData.removedAttachments));

      formData.attachments.forEach((file) => {
        submissionData.append('attachments', file); // Changed to 'attachments' to match backend expectation
      });

      await dispatch(updateProject({ projectId, updatedData: submissionData })).unwrap();

      toast.success('Project updated successfully!');
      router.push('/project');
    } catch (err) {
      toast.error(`Failed to update project: ${err.message || 'Unknown error'}`);
    }
  };

  const getFileIcon = (file) => {
    const fileName = file.name || 'unknown';
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <File className="text-orange-500" />;
      case 'txt':
        return <File className="text-gray-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  if (status.fetchProject === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-t-3 border-blue-600 mb-4"></div>
        <p className="text-blue-600 font-medium text-sm">Loading project details...</p>
      </div>
    );
  }

  if (status.fetchProject === 'failed') {
    return (
      <Card className="container mx-auto px-4 py-12 max-w-md border-blue-200">
        <CardContent className="pt-6">
          <p className="font-semibold text-lg text-blue-700 mb-2">Unable to load project</p>
          <p className="text-blue-600 text-sm">{error.fetchProject || 'An error occurred'}</p>
          <Button
            variant="outline"
            className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => dispatch(fetchProjectById(projectId))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={formRef} className="container mx-auto px-4 py-6 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/project')}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <CardTitle className="text-xl text-blue-800">Edit Project</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form id="project-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className={formErrors.projectName ? 'text-red-500' : 'text-blue-600'}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Project Name
                  {formErrors.projectName && <span className="text-xs">({formErrors.projectName})</span>}
                </div>
              </Label>
              <Input
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                className={formErrors.projectName ? 'border-red-300' : 'border-blue-200 focus:border-blue-400'}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className={formErrors.category ? 'text-red-500' : 'text-blue-600'}>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Category
                  {formErrors.category && <span className="text-xs">({formErrors.category})</span>}
                </div>
              </Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleChange({ target: { name: 'category', value } })}
                disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
              >
                <SelectTrigger className={formErrors.category ? 'border-red-300' : 'border-blue-200 focus:border-blue-400'}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="in house">In House</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.category === 'client' && (
              <div ref={clientSelectRef} className="space-y-2">
                <Label className={formErrors.clientId ? 'text-red-500' : 'text-blue-600'}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                    {formErrors.clientId && <span className="text-xs">({formErrors.clientId})</span>}
                  </div>
                </Label>
                <ClientSelect
                  value={formData.clientId}
                  isOpen={isClientSelectOpen}
                  onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, clientId: value }));
                    setIsClientSelectOpen(false);
                    setFormErrors((prev) => ({ ...prev, clientId: '' }));
                  }}
                  disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                />
              </div>
            )}

            <div ref={teamLeadSelectRef} className="space-y-2">
              <Label className={formErrors.teamLeadId ? 'text-red-500' : 'text-blue-600'}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Team Lead
                  {formErrors.teamLeadId && <span className="text-xs">({formErrors.teamLeadId})</span>}
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
                }}
                disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className={formErrors.startDate ? 'text-red-500' : 'text-blue-600'}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                  {formErrors.startDate && <span className="text-xs">({formErrors.startDate})</span>}
                </div>
              </Label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                className={formErrors.startDate ? 'border-red-300' : 'border-blue-200 focus:border-blue-400'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className={formErrors.endDate ? 'text-red-500' : 'text-blue-600'}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                  {formErrors.endDate && <span className="text-xs">({formErrors.endDate})</span>}
                </div>
              </Label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                className={formErrors.endDate ? 'border-red-300' : 'border-blue-200 focus:border-blue-400'}
              />
            </div>

            <Card
              className={`border ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-blue-200'} transition-colors duration-200`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => status.fetchProject !== 'loading' && status.updateProject !== 'loading' && fileInputRef.current?.click()}
            >
              <CardContent className="pt-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                />
                <div className="text-center mb-4">
                  <Upload className="mx-auto h-6 w-6 text-blue-500" />
                  <p className="text-blue-600 text-sm mt-2">
                    Drag & drop files or click to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT)
                  </p>
                </div>
                {(formData.attachments.length > 0 || formData.existingAttachments.length > 0) && (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
                    {formData.existingAttachments.map((file, index) => {
                      const fileName = file.name;
                      const extension = fileName.split('.').pop().toLowerCase();
                      const truncatedName = fileName.substring(0, Math.min(8, fileName.length - extension.length - 1));
                      const displayName = `${truncatedName}...${extension}`;

                      return (
                        <div
                          key={`existing-attachment-${file.id}`}
                          className="relative flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg text-sm hover:bg-blue-100 transition-all duration-200"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 text-gray-400 hover:text-red-400"
                            onClick={() => removeExistingAttachment(index)}
                            disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                          >
                            <X size={16} />
                          </Button>
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-2xl">{getFileIcon(file)}</div>
                            <span className="text-blue-600 text-xs text-center" title={fileName}>
                              {displayName}
                            </span>
                          </div>
                          <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full p-1">
                            <Check size={12} />
                          </div>
                        </div>
                      );
                    })}
                    {formData.attachments.map((file, index) => {
                      const fileName = file.name;
                      const extension = fileName.split('.').pop().toLowerCase();
                      const truncatedName = fileName.substring(0, Math.min(8, fileName.length - extension.length - 1));
                      const displayName = `${truncatedName}...${extension}`;

                      return (
                        <div
                          key={`attachment-${index}`}
                          className="relative flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg text-sm hover:bg-blue-100 transition-all duration-200"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 text-gray-400 hover:text-red-400"
                            onClick={() => removeFile(index)}
                            disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                          >
                            <X size={16} />
                          </Button>
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-2xl">{getFileIcon(file)}</div>
                            <span className="text-blue-600 text-xs text-center" title={fileName}>
                              {displayName}
                            </span>
                          </div>
                          <div className="absolute -top-1 -left-1 bg-green-500 text-white rounded-full p-1">
                            <Check size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-blue-200 h-full">
              <CardContent className="pt-6">
                <Label htmlFor="description" className={formErrors.description ? 'text-red-500' : 'text-blue-600'}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                    {formErrors.description && <span className="text-xs">({formErrors.description})</span>}
                  </div>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
                  className={formErrors.description ? 'border-red-300' : 'border-blue-200 focus:border-blue-400'}
                  placeholder="Describe your project..."
                />
              </CardContent>
            </Card>
          </div>
        </form>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            form="project-form"
            disabled={status.fetchProject === 'loading' || status.updateProject === 'loading'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {status.fetchProject === 'loading' || status.updateProject === 'loading' ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}