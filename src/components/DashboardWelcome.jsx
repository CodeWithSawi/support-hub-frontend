import { LifeBuoy } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

function DashboardWelcome() {
  const { user } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <section
      aria-labelledby="dashboard-welcome-title"
      className="flex flex-col gap-3 border-b pb-6 sm:gap-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <LifeBuoy aria-hidden="true" className="size-4" />
        <span>Support workspace</span>
      </div>

      <div className="space-y-2">
        <h2
          id="dashboard-welcome-title"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {greeting}, {firstName}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Here’s a clear view of your team’s ticket queue and recent activity.
        </p>
      </div>
    </section>
  );
}

export default DashboardWelcome;
