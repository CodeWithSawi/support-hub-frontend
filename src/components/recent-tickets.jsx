import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

import { useDashboard } from "@/context/DashboardContext";

const priorityStyles = {
  low: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusStyles = {
  open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  waiting_on_customer: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  resolved: "bg-green-500/10 text-green-600 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const formatStatus = (status) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function RecentTickets() {
  const { tickets, loading, error } = useDashboard();

  const latestTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Tickets</CardTitle>

          <CardDescription>
            A quick overview of the latest support tickets.
          </CardDescription>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link to="/tickets">View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading recent tickets...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-destructive"
                >
                  Failed to load recent tickets.
                </TableCell>
              </TableRow>
            ) : latestTickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tickets available.
                </TableCell>
              </TableRow>
            ) : (
              latestTickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        #{ticket._id.slice(-6).toUpperCase()}
                      </span>

                      <span className="text-muted-foreground text-xs">
                        {ticket.title}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {ticket.customerId?.name ?? "Unknown customer"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={priorityStyles[ticket.priority]}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[ticket.status]}
                    >
                      {formatStatus(ticket.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
