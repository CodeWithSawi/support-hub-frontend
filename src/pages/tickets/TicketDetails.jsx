import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "@/context/AuthContext";

import {
  IconArrowLeft,
  IconCalendar,
  IconSend,
  IconMessageCircle,
  IconUser,
} from "@tabler/icons-react";

import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  getTicketById,
  getTicketComments,
  createTicketComment,
  updateTicket,
  assignTicket,
  unassignTicket,
} from "@/services/ticketService";

import { getSupportAgents } from "@/services/userService";

const priorityStyles = {
  low: "border-green-500/30 bg-green-500/10 text-green-600",
  medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-600",
  urgent: "border-red-500/30 bg-red-500/10 text-red-600",
};

const statusStyles = {
  open: "border-blue-500/30 bg-blue-500/10 text-blue-600",
  in_progress: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
  waiting_on_customer: "border-orange-500/30 bg-orange-500/10 text-orange-600",
  resolved: "border-green-500/30 bg-green-500/10 text-green-600",
  closed: "border-muted bg-muted text-muted-foreground",
};

const formatLabel = (value = "") =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const TicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentsError, setCommentsError] = useState("");

  // Reply states
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Ticket update states
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [savingTicket, setSavingTicket] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Ticket assignment states
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setCommentsError("");

        const ticketData = await getTicketById(ticketId);

        if (ignore) return;

        setTicket(ticketData);
        setPriority(ticketData.priority);
        setStatus(ticketData.status);

        try {
          const commentsData = await getTicketComments(ticketId);

          if (!ignore) {
            setComments(commentsData);
          }
        } catch (commentError) {
          if (!ignore) {
            setCommentsError(
              commentError.message || "Failed to load comments.",
            );
          }
        }
      } catch (ticketError) {
        if (!ignore) {
          setError(ticketError.message || "Failed to load ticket details.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (ticketId) {
      fetchTicketDetails();
    } else {
      setError("No ticket ID was provided.");
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [ticketId]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchAgents = async () => {
      try {
        setLoadingAgents(true);
        setAssignmentError("");

        const data = await getSupportAgents();

        setAgents(data);
      } catch (error) {
        setAssignmentError(error.message || "Failed to load support agents.");
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [user]);

  // Submit a new conversation comment
  const handleReply = async (event) => {
    event.preventDefault();

    const message = reply.trim();

    if (!message || sendingReply) return;

    try {
      setSendingReply(true);
      setReplyError("");

      const response = await createTicketComment(ticketId, message);

      setComments((previousComments) => [
        ...previousComments,
        response.comment,
      ]);

      setReply("");
    } catch (error) {
      setReplyError(error.message || "Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  // Save ticket priority and status
  const handleTicketUpdate = async (event) => {
    event.preventDefault();

    if (savingTicket || !canUpdateTicket) return;

    try {
      setSavingTicket(true);
      setUpdateError("");
      setUpdateSuccess("");

      await updateTicket(ticketId, {
        priority,
        status,
      });

      // Fetch the updated ticket from the backend.
      // This also ensures populated customer and agent details remain available.
      const updatedTicket = await getTicketById(ticketId);

      setTicket(updatedTicket);
      setPriority(updatedTicket.priority);
      setStatus(updatedTicket.status);

      setUpdateSuccess("Ticket updated successfully.");
    } catch (error) {
      setUpdateError(error.message || "Failed to update ticket.");
    } finally {
      setSavingTicket(false);
    }
  };

  // Assign or unassign a ticket
  const handleAssignment = async (event) => {
    event.preventDefault();

    if (savingAssignment || user?.role !== "admin") return;

    const currentAgentId = assignedAgent?._id ? String(assignedAgent._id) : "";

    if (selectedAgentId === currentAgentId) return;

    try {
      setSavingAssignment(true);
      setAssignmentError("");
      setAssignmentSuccess("");

      if (selectedAgentId) {
        await assignTicket(ticketId, selectedAgentId);
      } else {
        await unassignTicket(ticketId);
      }

      // Retrieve the updated ticket from the backend.
      const updatedTicket = await getTicketById(ticketId);

      setTicket(updatedTicket);
      setSelectedAgentId(
        updatedTicket.assignedAgentId?._id
          ? String(updatedTicket.assignedAgentId._id)
          : "",
      );

      setAssignmentSuccess(
        selectedAgentId
          ? "Ticket assigned successfully."
          : "Ticket unassigned successfully.",
      );
    } catch (error) {
      setAssignmentError(
        error.message || "Failed to update ticket assignment.",
      );
    } finally {
      setSavingAssignment(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading ticket details...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold">
          {error?.includes("Forbidden")
            ? "Access denied"
            : "Ticket unavailable"}
        </h2>

        <p className="text-sm text-muted-foreground">
          {error || "We couldn't find the requested ticket."}
        </p>

        <Button onClick={() => navigate("/tickets")}>
          <IconArrowLeft />
          Back to tickets
        </Button>
      </div>
    );
  }

  const customer = ticket.customerId;
  const assignedAgent = ticket.assignedAgentId;

  // Only admins and assigned support agents can update tickets.
  const canUpdateTicket =
    user?.role === "admin" ||
    (user?.role === "support_agent" &&
      String(assignedAgent?._id) === String(user?._id));

  const hasTicketChanges =
    priority !== ticket.priority || status !== ticket.status;

  return (
    <div className="flex flex-col gap-6">
      {/* Page navigation */}
      <div>
        <Button
          variant="ghost"
          className="-ml-3 mb-3"
          onClick={() => navigate("/tickets")}
        >
          <IconArrowLeft />
          Back to tickets
        </Button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              #{ticket._id.slice(-6).toUpperCase()}
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              {ticket.title}
            </h1>

            <p className="text-sm text-muted-foreground">
              Created on {formatDate(ticket.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={priorityStyles[ticket.priority]}
            >
              {formatLabel(ticket.priority)}
            </Badge>

            <Badge variant="outline" className={statusStyles[ticket.status]}>
              {formatLabel(ticket.status)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Conversation */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMessageCircle className="size-5" />
                Conversation
              </CardTitle>

              <CardDescription>
                Messages between the customer and support team.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Comments */}
              <div className="space-y-6">
                {commentsError ? (
                  <p className="text-sm text-destructive">{commentsError}</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments have been added to this ticket yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <IconUser className="size-5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {comment.authorId?.name || "Unknown user"}
                          </span>

                          <Badge variant="secondary">
                            {formatLabel(comment.authorId?.role || "user")}
                          </Badge>
                        </div>

                        <p className="text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
                          {comment.body}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply form */}
              <Separator />

              <form onSubmit={handleReply} className="space-y-3">
                <Textarea
                  placeholder="Write your reply..."
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={4}
                  disabled={sendingReply}
                />

                {replyError && (
                  <p className="text-sm text-destructive">{replyError}</p>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!reply.trim() || sendingReply}
                  >
                    <IconSend />
                    {sendingReply ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Ticket information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>

              <CardDescription>
                Details about this support ticket.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Customer */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Customer</p>

                <div className="flex items-center gap-2 font-medium">
                  <IconUser className="size-4 text-muted-foreground" />
                  {customer?.name || "Unknown customer"}
                </div>

                {customer?.email && (
                  <p className="text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                )}
              </div>

              <Separator />

              {/* Created date */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created</p>

                <div className="flex items-center gap-2 text-sm font-medium">
                  <IconCalendar className="size-4 text-muted-foreground" />
                  {formatDate(ticket.createdAt)}
                </div>
              </div>

              <Separator />

              {/* Category */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>

                <p className="text-sm font-medium">
                  {formatLabel(ticket.category || "Uncategorized")}
                </p>
              </div>

              <Separator />

              {/* Assigned agent */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Assigned Agent
                  </p>

                  <p className="text-sm font-medium">
                    {assignedAgent?.name || "Unassigned"}
                  </p>

                  {assignedAgent?.email && (
                    <p className="text-xs text-muted-foreground">
                      {assignedAgent.email}
                    </p>
                  )}
                </div>

                {/* Admin assignment controls */}
                {user?.role === "admin" && (
                  <form onSubmit={handleAssignment} className="space-y-3">
                    <div className="space-y-2">
                      <label
                        htmlFor="assigned-agent"
                        className="text-sm font-medium"
                      >
                        Assign to Support Agent
                      </label>

                      <select
                        id="assigned-agent"
                        value={selectedAgentId}
                        onChange={(event) => {
                          setSelectedAgentId(event.target.value);
                          setAssignmentError("");
                          setAssignmentSuccess("");
                        }}
                        disabled={loadingAgents || savingAssignment}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Unassigned</option>

                        {assignedAgent?._id &&
                          !agents.some(
                            (agent) =>
                              String(agent._id) === String(assignedAgent._id),
                          ) && (
                            <option value={String(assignedAgent._id)}>
                              {assignedAgent.name} (currently assigned)
                            </option>
                          )}

                        {agents.map((agent) => (
                          <option key={agent._id} value={String(agent._id)}>
                            {agent.name} ({agent.email})
                          </option>
                        ))}
                      </select>

                      {loadingAgents && (
                        <p className="text-xs text-muted-foreground">
                          Loading support agents...
                        </p>
                      )}

                      {!loadingAgents && agents.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No active support agents available.
                        </p>
                      )}
                    </div>

                    {assignmentError && (
                      <p className="text-sm text-destructive">
                        {assignmentError}
                      </p>
                    )}

                    {assignmentSuccess && (
                      <p className="text-sm text-green-600">
                        {assignmentSuccess}
                      </p>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          loadingAgents ||
                          savingAssignment ||
                          selectedAgentId ===
                            (assignedAgent?._id
                              ? String(assignedAgent._id)
                              : "")
                        }
                      >
                        {savingAssignment
                          ? "Updating Assignment..."
                          : "Save Assignment"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Ticket update controls */}
              {canUpdateTicket && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Manage Ticket</h3>

                      <p className="text-sm text-muted-foreground">
                        Update the priority and status of this ticket.
                      </p>
                    </div>

                    <form onSubmit={handleTicketUpdate} className="space-y-4">
                      {/* Priority */}
                      <div className="space-y-2">
                        <label
                          htmlFor="ticket-priority"
                          className="text-sm font-medium"
                        >
                          Priority
                        </label>

                        <select
                          id="ticket-priority"
                          value={priority}
                          onChange={(event) => {
                            setPriority(event.target.value);
                            setUpdateError("");
                            setUpdateSuccess("");
                          }}
                          disabled={savingTicket}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <label
                          htmlFor="ticket-status"
                          className="text-sm font-medium"
                        >
                          Status
                        </label>

                        <select
                          id="ticket-status"
                          value={status}
                          onChange={(event) => {
                            setStatus(event.target.value);
                            setUpdateError("");
                            setUpdateSuccess("");
                          }}
                          disabled={savingTicket}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="waiting_on_customer">
                            Waiting on Customer
                          </option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      {/* Update feedback */}
                      {updateError && (
                        <p className="text-sm text-destructive">
                          {updateError}
                        </p>
                      )}

                      {updateSuccess && (
                        <p className="text-sm text-green-600">
                          {updateSuccess}
                        </p>
                      )}

                      {/* Save button */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!hasTicketChanges || savingTicket}
                      >
                        {savingTicket ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
