import { apiRequest } from "./api";

export const getTicketById = (ticketId) => {
  return apiRequest(`/tickets/${ticketId}`);
};

export const getTicketComments = (ticketId) => {
  return apiRequest(`/tickets/${ticketId}/comments`);
};

export const createTicketComment = (ticketId, body) => {
  return apiRequest(`/tickets/${ticketId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
};

export const assignTicket = (ticketId, assignedAgentId) => {
  return apiRequest(`/tickets/${ticketId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ assignedAgentId }),
  });
};

export const unassignTicket = (ticketId) => {
  return apiRequest(`/tickets/${ticketId}/unassign`, {
    method: "PATCH",
  });
};

export const updateTicket = (ticketId, updates) => {
  return apiRequest(`/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};
