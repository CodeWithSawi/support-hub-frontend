import * as React from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IconDotsVertical, IconSearch } from "@tabler/icons-react";

// Convert backend status values into readable labels.
const getStatusLabel = (status) => {
  const labels = {
    open: "Open",
    in_progress: "In Progress",
    waiting_on_customer: "Waiting on Customer",
    pending: "Waiting on Customer",
    resolved: "Resolved",
    closed: "Closed",
  };

  return labels[status] ?? status;
};

// Style priority badges.
const getPriorityClass = (priority) => {
  const styles = {
    urgent:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
    high: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400",
    medium:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400",
    low: "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400",
  };

  return styles[priority] ?? "";
};

// Style status badges.
const getStatusClass = (status) => {
  const styles = {
    open: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400",
    in_progress:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400",
    waiting_on_customer:
      "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400",
    pending:
      "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400",
    resolved:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400",
    closed: "border-muted bg-muted text-muted-foreground",
  };

  return styles[status] ?? "";
};

// Format dates for display.
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export function TicketsTable({ tickets }) {
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState("10");

  // Search and filter the tickets.
  const filteredTickets = React.useMemo(() => {
    return tickets.filter((ticket) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        ticket.id.toLowerCase().includes(searchValue) ||
        ticket.subject.toLowerCase().includes(searchValue) ||
        ticket.customer.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        ticket.status === statusFilter ||
        (statusFilter === "waiting_on_customer" && ticket.status === "pending");

      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  // Pagination calculations.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / Number(pageSize)),
  );

  const paginatedTickets = filteredTickets.slice(
    (page - 1) * Number(pageSize),
    page * Number(pageSize),
  );

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
    setPage(1);
  };

  const handlePageSize = (value) => {
    setPageSize(value);
    setPage(1);
  };

  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <CardTitle>All Tickets</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all support tickets.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-9 sm:w-[220px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="sm:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Waiting on Customer</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
            <SelectTrigger className="sm:w-[150px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{ticket.id}</span>
                        <span className="max-w-[320px] text-sm text-muted-foreground">
                          {ticket.subject}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{ticket.customer}</TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getPriorityClass(ticket.priority)}
                      >
                        {ticket.priority.charAt(0).toUpperCase() +
                          ticket.priority.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusClass(ticket.status)}
                      >
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label={`Actions for ${ticket.id}`}
                            />
                          }
                        >
                          <IconDotsVertical className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                          >
                            View ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {filteredTickets.length === 0
              ? 0
              : (page - 1) * Number(pageSize) + 1}
            {"–"}
            {Math.min(page * Number(pageSize), filteredTickets.length)} of{" "}
            {filteredTickets.length} tickets
          </p>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Rows per page
              </span>

              <Select value={pageSize} onValueChange={handlePageSize}>
                <SelectTrigger className="w-[75px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {[5, 10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                <span className="sr-only">Previous page</span>
                &lt;
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                <span className="sr-only">Next page</span>
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
