
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchTaskById, updateTaskStatus } from "@/features/taskSlice";
import { createBug } from "@/features/bugSlice";
import { useLoggedinUser } from "@/hooks/useLoggedinUser";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
  Bug,
  Hash,
  Briefcase,
  Mail,
  UserCheck,
  AlertCircle,
  Flag,
} from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";

const ViewTask = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const task_id = params.id;
  const task = useSelector((state) => state.task.currentTask);
  const loading = useSelector((state) => state.task.status === "loading");
  const error = useSelector((state) => state.task.error);
  const { currentUser, isTeamLead } = useLoggedinUser(task?.teamLeadId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugPriority, setBugPriority] = useState("Medium");
  const [actionType, setActionType] = useState("status");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (task_id) {
      dispatch(fetchTaskById(task_id));
    }
  }, [dispatch, task_id]);

  useEffect(() => {
    if (task) {
      setSelectedStatus(task.status);
      setIsVisible(true);
    }
  }, [task]);

  const closeViewModal = () => {
    setIsVisible(false);
    setTimeout(() => router.back(), 300);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBugTitle("");
    setBugDescription("");
    setBugPriority("Medium");
    setActionType("status");
  };

  const handleSubmit = async () => {
    if (actionType === "status") {
      dispatch(updateTaskStatus({ task_id: task_id, status: selectedStatus }))
        .unwrap()
        .then(() => {
          toast.success("Task status updated successfully!");
        })
        .catch((err) => {
          toast.error(`Failed to update task status: ${err.message || err}`);
        });
    } else if (actionType === "bug") {
      if (!bugTitle.trim() || !bugDescription.trim()) {
        toast.error("Please provide both a bug title and description.");
        return;
      }
      dispatch(
        createBug({
          title: bugTitle,
          description: bugDescription,
          task_id: task_id,
          priority: bugPriority,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Bug reported successfully!");
        })
        .catch((err) => {
          toast.error(`Failed to report bug: ${err}`);
        });
    }
    closeModal();
  };

  const taskStatusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "In Verification": "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
  };

  const statusOptions = Object.keys(taskStatusStyles);
  const priorityOptions = ["Low", "Medium", "High"];
  const isCPC = currentUser?.position === "CPC";
  const isTeamLead2 = task?.assignedByDetails?.memberId === currentUser?.employeeID;

  const canReportBug = isCPC || isTeamLead2;



  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl animate-pulse">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium text-base">
              Loading task details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-red-200 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium text-base mb-6">
              Error: {error}
            </p>
            <button
              onClick={() => dispatch(fetchTaskById(task_id))}
              className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-lg text-base font-medium hover:bg-red-200 transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-base font-medium text-gray-600">Task not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/10 rounded-full animate-[float-delayed_25s_ease-in-out_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mb-8 bg-gray-50 rounded-lg">
            <button
              onClick={closeViewModal}
              className="inline-flex items-center gap-2 text-indigo-600 bg-white px-4 py-2 rounded-lg font-medium text-sm border border-indigo-100 hover:bg-indigo-50 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-500 transition-all duration-300"
            >
              <FiEdit className="h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Task Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Title", value: task.title, Icon: Hash, color: "indigo" },
                    { label: "Task ID", value: task.task_id, Icon: Hash, color: "indigo" },
                    { label: "Project ID", value: task.projectId, Icon: Briefcase, color: "purple" },
                    { label: "Project Name", value: task.projectName, Icon: FileText, color: "indigo" },
                    { label: "Assigned To", value: task.assignedTo, Icon: Mail, color: "green" },
                    { label: "Assigned By", value: task.assignedBy, Icon: UserCheck, color: "indigo" },
                    { label: "Task Priority", value: task.priority, Icon: Flag, color: "red" },
                    { label: "Deadline", value: new Date(task.deadline).toLocaleDateString(), Icon: Calendar, color: "orange" },
                    { label: "Status", value: task.status, Icon: Clock, color: "indigo" },
                    { label: "Review Status", value: task.reviewStatus, Icon: AlertCircle, color: "yellow" },
                    { label: "Created At", value: new Date(task.createdAt).toLocaleDateString(), Icon: Calendar, color: "gray" },
                  ].map(({ label, value, Icon, color }, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-${color}-50 rounded-md`}>
                          <Icon className={`h-4 w-4 text-${color}-600`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{label}</p>
                          <p
                            className={`text-sm font-semibold ${
                              label === "Status"
                                ? `${
                                    taskStatusStyles[value] || "text-gray-600"
                                  } px-2 py-1 rounded-full text-xs`
                                : "text-gray-900"
                            }`}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg border border-gray-100 p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Description
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] text-sm text-gray-700">
                  {task.description || (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No description available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <Bug className="h-5 w-5 text-indigo-600" />
              Manage Task
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActionType("status")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    actionType === "status"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Update Status
                </button>
                {canReportBug && (
                  <button
                    onClick={() => setActionType("bug")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                      actionType === "bug"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Report Bug
                  </button>
                )}
              </div>

              {actionType === "status" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Update Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 p-3 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {actionType === "bug" && canReportBug && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bug Title
                    </label>
                    <input
                      type="text"
                      value={bugTitle}
                      onChange={(e) => setBugTitle(e.target.value)}
                      className="block w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter bug title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bug Description
                    </label>
                    <textarea
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      className="block w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      placeholder="Describe the bug..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bug Priority
                    </label>
                    <select
                      value={bugPriority}
                      onChange={(e) => setBugPriority(e.target.value)}
                      className="block w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    actionType === "bug" &&
                    (!bugTitle.trim() || !bugDescription.trim())
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTask;