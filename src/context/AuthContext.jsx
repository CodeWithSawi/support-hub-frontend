import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/authService";

// Create the authentication context
const AuthContext = createContext(null);

// Create the authentication provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether a user is already authenticated
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        logoutUser();
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser._id) {
          throw new Error("Invalid stored user.");
        }

        // Fetch the latest user information from the backend
        const currentUser = await getCurrentUser(parsedUser._id);

        if (currentUser.accountStatus !== "active") {
          throw new Error("Your account is not active.");
        }

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Session restoration failed:", error);
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Log in a user
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setUser(data.user);

    return data;
  };

  // Register a new customer
  const register = async (userData) => {
    return registerUser(userData);
  };

  // Log out the current user
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for accessing authentication
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
