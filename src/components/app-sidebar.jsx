import { NavLink } from "react-router";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  IconDashboard,
  IconTicket,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconHelpCircle,
  IconCommand,
} from "@tabler/icons-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard stroke={2} />,
    },
    {
      title: "My Tickets",
      url: "/tickets",
      icon: <IconTicket stroke={2} />,
    },
    {
      title: "Customers",
      url: "/users",
      icon: <IconUsers stroke={2} />,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: <IconChartBar stroke={2} />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <IconSettings stroke={2} />,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: <IconHelpCircle stroke={2} />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-14 gap-3 p-2"
              render={<NavLink to="/dashboard" />}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:size-8">
                <IconCommand stroke={2} className="size-5" />
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-semibold tracking-tight">
                  Support Hub
                </span>
                <span className="block truncate text-[11px] font-normal text-muted-foreground">
                  Support workspace
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2 py-2">
        <NavMain items={data.navMain} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto border-t border-sidebar-border/70 pt-3"
        />
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border/70 p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-between gap-2 px-1 group-data-[collapsible=icon]:justify-center">
          <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Appearance
          </span>
          <ModeToggle />
        </div>
        <NavUser
          user={{
            name: user?.name || "Support Hub",
            email: user?.email || "support@example.com",
            avatar: user?.avatar || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
