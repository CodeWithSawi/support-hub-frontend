import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

import { getDashboardTickets } from "@/services/dashboardService";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardTickets();

        // Adapt backend ticket fields to the table's existing structure.
        const formattedTickets = data.map((ticket) => ({
          id: ticket._id,
          subject: ticket.title,
          customer: ticket.customerId?.name ?? "Unknown customer",
          priority: ticket.priority,
          status: ticket.status,
          createdAt: ticket.createdAt,
        }));

        setTickets(formattedTickets);
      } catch (error) {
        setError(error.message || "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const stats = [
    {
      title: "Total Tickets",
      value: tickets.length,
      description: "All tickets in the system",
    },
    {
      title: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "open").length,
      description: "Tickets awaiting attention",
    },
    {
      title: "In Progress",
      value: tickets.filter((ticket) => ticket.status === "in_progress").length,
      description: "Tickets currently being handled",
    },
    {
      title: "Resolved Tickets",
      value: tickets.filter(
        (ticket) => ticket.status === "resolved" || ticket.status === "closed",
      ).length,
      description: "Resolved or closed tickets",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>

        <p className="text-muted-foreground">
          Manage and monitor all support tickets.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{stat.title}</p>

              <p className="text-2xl font-semibold">
                {loading ? "—" : stat.value.toLocaleString()}
              </p>

              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          Failed to load tickets: {error}
        </p>
      ) : loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading tickets...
        </p>
      ) : (
        <DataTable data={tickets} />
      )}
    </div>
  );
};

export default TicketsPage;
