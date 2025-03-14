import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        setUser(storedName);
    }
}, [user]); // Depend on `user`, so UI updates immediately

  const login = (name: string) => {
    localStorage.setItem("userName", name);
    setUser(name);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("No refresh token found in local storage. Cannot logout.");
        return;
      }

      // Remove refresh token from local storage first
      localStorage.removeItem("userName");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("Sending logout request with refreshToken:", refreshToken); // Debugging

      await axios.post("http://localhost:3000/api/auth/logout", { refreshToken });

      // Ensure refreshToken is removed after logout
      localStorage.removeItem("userName");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setUser(null);
      console.log("Local storage after logout:", localStorage.getItem("refreshToken")); // Debugging

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}