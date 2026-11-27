import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { Eye, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort,
} from "@tabler/icons-react";

const columnHelper = createColumnHelper();

// Priority badge styles
const priorityStyles = {
  urgent: "border-red-500/30 bg-red-500/10 text-red-500",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-500",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
  low: "border-green-500/30 bg-green-500/10 text-green-500",
};

// Status badge styles
const statusStyles = {
  open: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  in_progress: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
  waiting_on_customer: "border-purple-500/30 bg-purple-500/10 text-purple-500",
  resolved: "border-green-500/30 bg-green-500/10 text-green-500",
  closed: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

// Readable status labels
const statusLabels = {
  open: "Open",
  in_progress: "In Progress",
  waiting_on_customer: "Waiting on Customer",
  resolved: "Resolved",
  closed: "Closed",
};

// Reusable sortable header
const SortableHeader = ({ column, children }) => {
  const sorted = column.getIsSorted();

  return (
    <button
      onClick={column.getToggleSortingHandler()}
      className="flex items-center gap-2 hover:text-foreground"
    >
      {children}

      {sorted === "asc" ? (
        <IconArrowUp className="size-4" />
      ) : sorted === "desc" ? (
        <IconArrowDown className="size-4" />
      ) : (
        <IconArrowsSort className="size-4 opacity-50" />
      )}
    </button>
  );
};

// Ticket actions dropdown
const TicketActions = ({ ticketId }) => {
  const navigate = useNavigate();

  const handleViewDetails = (event) => {
    event.stopPropagation();
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ticket actions"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 size-4" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns = [
  columnHelper.display({
    id: "select",
    header: "Select",
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select ticket ${row.original.id}`}
      />
    ),
  }),

  columnHelper.accessor("id", {
    header: ({ column }) => (
      <SortableHeader column={column}>Ticket ID</SortableHeader>
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),

  columnHelper.accessor("subject", {
    header: ({ column }) => (
      <SortableHeader column={column}>Subject</SortableHeader>
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),

  columnHelper.accessor("customer", {
    header: ({ column }) => (
      <SortableHeader column={column}>Customer</SortableHeader>
    ),
  }),

  columnHelper.accessor("priority", {
    header: ({ column }) => (
      <SortableHeader column={column}>Priority</SortableHeader>
    ),
    cell: ({ getValue }) => {
      const priority = getValue();

      return (
        <Badge variant="outline" className={priorityStyles[priority]}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      );
    },
  }),

  columnHelper.accessor("status", {
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <Badge variant="outline" className={statusStyles[status]}>
          {statusLabels[status] ?? status}
        </Badge>
      );
    },
  }),

  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
  }),

  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => <TicketActions ticketId={row.original.id} />,
  }),
];
