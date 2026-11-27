import DashboardWelcome from "@/components/DashboardWelcome";
import { TicketPriorityChart } from "@/components/ticket-priority-chart";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { RecentTickets } from "@/components/recent-tickets";

import { DashboardProvider } from "@/context/DashboardContext";

function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="mx-auto flex w-full min-w-0 max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8">
        <DashboardWelcome />
        <SectionCards />
        <ChartAreaInteractive />
        <TicketPriorityChart />
        <RecentTickets />
      </div>
    </DashboardProvider>
  );
}

export default DashboardPage;
