// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Loader2 } from "lucide-react";

// 👤 User type
interface User {
  id: string;
  email: string;
  role: "admin" | "agent" | "user";
  name?: string;
}

// 🔑 Context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

// 📦 Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // The token is automatically added to requests via the axios interceptor
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check if user has required role(s)
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const userRole = user.role.toLowerCase();

    if (Array.isArray(roles)) {
      return roles.some(role => userRole === role.toLowerCase());
    }

    return userRole === roles.toLowerCase();
  };

  // Handle user sign in
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/login`, { email, password });

      const { user: userData, token } = response.data;

      // Save user data and token
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      // Set axios auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on role
      if (userData.role === "admin" || userData.role === "agent") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

      return userData;
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user sign out
  const signOut = () => {
    // Clear auth data
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Remove axios auth header
    delete axios.defaults.headers.common["Authorization"];

    // Redirect to sign in page
    navigate("/signin", { replace: true });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    hasRole,
  };

  // ✅ Loader while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔑 Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
