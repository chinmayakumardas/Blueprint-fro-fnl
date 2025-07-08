




"use client"

import * as React from "react"
import {
  LayoutDashboard,
  GalleryVerticalEnd,
  CalendarDays,
  PhoneCall as IconPhoneCall,
  CalendarEvent as IconCalendarEvent,
  Folder as FolderClosed,
  User as IconUser,
  Folder as IconFolder,
  Users as IconUsers,
  CheckSquare as IconChecklist,
  BugIcon,
} from 'lucide-react';

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BluePrint",
      logo: GalleryVerticalEnd,
      plan: "Project Management",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: IconPhoneCall,
    },
    {
      title: "Meeting",
      url: "#",
      icon: CalendarDays,
      items: [
        { title: "All Meetings", url: "/meetings/all" },
        { title: "Calendar", url: "/meetings/calendar" },
        { title: "Scheduled", url: "/meetings/scheduled" },
        { title: "Mom Cause", url: "/meetings/cause" },
      ],
    },
    {
      title: "Quotation",
      url: "/quotation",
      icon: IconPhoneCall,
    },
    {
      title: "Client",
      url: "/client",
      icon: IconUser,
    },
    {
      title: "Project",
      url: "/project",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/team",
      icon: IconUsers,
    },
    {
      title: "Task",
      url: "/task",
      icon: IconChecklist,
    },
    {
      title: "Bug",
      url: "/bug",
      icon: BugIcon,
    },
    {
      title: "Master",
      url: "#",
      icon: FolderClosed,
      items: [
        { title: "Service", url: "/master/services" },
        { title: "Industry", url: "/master/industry" },
        { title: "Meeting Slots", url: "/master/slots" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { employeeData } = useSelector((state) => state.user) || {};
  const userRole = employeeData?.designation;

  // Role-based filtering
 const navdata =
  userRole === "cpc"||"CPC"
    ? data.navMain
    : data.navMain.filter((item) =>
        ["Dashboard", "Project", "Task", "Team"].includes(item.title)
      );

  return (
    <Sidebar collapsible="icon" className="bg-[#0F1D41]" {...props}>
      <SidebarHeader className="bg-[#0F1D41] border-b border-[#374151]">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-[#0F1D41]">
        <NavMain items={navdata} />
      </SidebarContent>
      {/* <SidebarFooter className="bg-[#0F1D41] border-t border-[#374151]">
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}