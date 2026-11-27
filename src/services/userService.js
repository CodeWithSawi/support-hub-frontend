import { apiRequest } from "./api";

export const getSupportAgents = async () => {
  return apiRequest("/users/agents");
};
