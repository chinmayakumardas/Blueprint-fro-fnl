'use client'

import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  const { userData, employeeData, loading } = useSelector((state) => state.user);

  const currentUser = {
    id: employeeData?.employeeID || userData?.id || null,
    name: employeeData?.name || userData?.fullName || "Unknown",
    email: employeeData?.email || userData?.email || "",
    role: employeeData?.designation?.toLowerCase() || "employee",
    profilePicture: userData?.profilePicture || null,
    department: employeeData?.department || "",
  };

  return {
    currentUser,
    loading,
    isTeamLead: currentUser.role === "team_lead",
    isEmployee: currentUser.role === "employee",
    isCpc: currentUser.role === "cpc"||"CPC",
  };
};
