import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDashboard } from "@/context/DashboardContext";

export function SectionCards() {
  const { tickets, loading, error } = useDashboard();

  const ticketStats = [
    {
      title: "Total Tickets",
      value: tickets.length,
      description: "All active tickets in the system",
      footer: "Total number of active tickets",
    },
    {
      title: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "open").length,
      description: "Tickets awaiting attention",
      footer: "Tickets that still need to be handled",
    },
    {
      title: "In Progress",
      value: tickets.filter((ticket) => ticket.status === "in_progress").length,
      description: "Tickets currently being handled",
      footer: "Tickets assigned and being worked on",
    },
    {
      title: "Resolved Tickets",
      value: tickets.filter((ticket) => ticket.status === "resolved").length,
      description: "Tickets with a resolved status",
      footer: "Tickets marked as resolved",
    },
  ];

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Failed to load ticket statistics: {error}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ticketStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading ? "—" : stat.value.toLocaleString()}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <p className="font-medium">{stat.description}</p>

            <p className="text-muted-foreground">{stat.footer}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
