import { apiRequest } from "./api";

export const getDashboardTickets = async () => {
  return apiRequest("/tickets");
};
