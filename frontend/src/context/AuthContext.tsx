"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

interface User {
  _id: string;
  name?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  santa: User | null;
  loading: boolean;
  error: string | null;
  logoutUser: () => void;
  logoutSanta: () => void;
  refreshUser: () => Promise<void>;
  refreshSanta: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [santa, setSanta] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { role: "user" },
        { withCredentials: true }
      );
      if (response.data.role === "user" && response.data.token) {
        localStorage.setItem("wishly_user_token", response.data.token);
        return response.data.token;
      }
    } catch (err) {
      console.error("Failed to refresh user token:", err);
      localStorage.removeItem("wishly_user_token");
    }
    return null;
  };

  const refreshSantaToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { role: "santa" },
        { withCredentials: true }
      );
      if (response.data.role === "santa" && response.data.token) {
        localStorage.setItem("wishly_santa_token", response.data.token);
        return response.data.token;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        console.error("Failed to refresh santa token:", err);
      }
      localStorage.removeItem("wishly_santa_token");
    }
    return null;
  };

  const fetchUser = async () => {
    let token = localStorage.getItem("wishly_user_token");

    if (!token) {
      token = await refreshUserToken();
      if (!token) {
        setUser(null);
        return;
      }
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        token = await refreshUserToken();
        if (token) {
          try {
            const response = await axios.get(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUser(response.data);
            setError(null);
            return;
          } catch (retryErr) {
            console.error("Failed to fetch user after refresh:", retryErr);
          }
        }
      }
      console.error("Failed to fetch user:", err);
      setError("Failed to authenticate user");
      localStorage.removeItem("wishly_user_token");
      setUser(null);
    }
  };

  const fetchSanta = async () => {
    let token = localStorage.getItem("wishly_santa_token");

    if (!token) {
      token = await refreshSantaToken();
      if (!token) {
        setSanta(null);
        return;
      }
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSanta(response.data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        token = await refreshSantaToken();
        if (token) {
          try {
            const response = await axios.get(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setSanta(response.data);
            setError(null);
            return;
          } catch (retryErr) {
            console.error("Failed to fetch santa after refresh:", retryErr);
          }
        }
      }
      console.error("Failed to fetch santa:", err);
      setError("Failed to authenticate santa");
      localStorage.removeItem("wishly_santa_token");
      setSanta(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await Promise.all([fetchUser(), fetchSanta()]);
      setLoading(false);
    };
    initAuth();
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch { }

    localStorage.removeItem("wishly_user_token");
    setUser(null);
    window.location.href = "/login";
  };

  const logoutSanta = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch { }

    localStorage.removeItem("wishly_santa_token");
    setSanta(null);
    window.location.href = "/santa/login";
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const refreshSanta = async () => {
    await fetchSanta();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        santa,
        loading,
        error,
        logoutUser,
        logoutSanta,
        refreshUser,
        refreshSanta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
