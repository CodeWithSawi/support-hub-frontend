import { createContext, useContext, useEffect, useState } from "react";

import { getDashboardTickets } from "@/services/dashboardService";
import { useAuth } from "@/context/AuthContext";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardTickets();

        setTickets(data);
      } catch (error) {
        setError(error.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user && ["admin", "support_agent"].includes(user.role)) {
      fetchTickets();
    } else {
      setTickets([]);
      setLoading(false);
    }
  }, [user]);

  const value = {
    tickets,
    loading,
    error,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider.");
  }

  return context;
};
