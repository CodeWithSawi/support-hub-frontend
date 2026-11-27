import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
