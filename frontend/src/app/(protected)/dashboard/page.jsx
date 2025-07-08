// "use client";

// import { useCurrentUser } from "@/hooks/useCurrentUser";
// // import CpcDashboard from "@/components/dashboard/dashboardcontainer/CpcDashboard";
// // import EmployeeDashboard from "@/components/dashboard/dashboardcontainer/EmployeeDashboard";

// export default function DashboardPage() {
//   const { currentUser, loading, isCpc } = useCurrentUser();

//   if (loading) {
//     return <div className="p-8 font-semibold">Loading dashboard...</div>;
//   }

//   return (
//     <div className="p-4">
//       {/* {isCpc ? (
//         <CpcDashboard currentUser={currentUser} />
//       ) : (
//         <EmployeeDashboard currentUser={currentUser} />
//       )} */}
      
//     </div>
//   );
// }



"use client";
import { SectionCards } from "@/modules/dashboard/section-cards";
import { ChartAreaInteractive } from "@/modules/dashboard/chart-area-interactive";
import { DataTable } from "@/modules/dashboard/data-table";


export default function Dashboard() {






  return (
    <div className="space-y-6">
  <SectionCards />

  <div className="px-4 lg:px-6">
    <ChartAreaInteractive />
  </div>

  <DataTable />
</div>

  );
}
