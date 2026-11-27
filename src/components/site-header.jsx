import { useLocation } from "react-router";
import { CalendarDays } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/tickets": "My Tickets",
  "/users": "Customers",
};

export function SiteHeader() {
  const location = useLocation();
  const now = new Date();

  const pageTitle = location.pathname.startsWith("/tickets/")
    ? "Ticket Details"
    : pageTitles[location.pathname] || "Support Hub";

  const dateTime = now.toISOString();
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-vertical:self-auto"
          />

          <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <time
            dateTime={dateTime}
            className="flex items-center gap-1.5"
          >
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {dateLabel}
          </time>
        </div>
      </div>
    </header>
  );
}
