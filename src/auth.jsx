
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("nettutor_token");

    if (!token) {
      setReady(true);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem("nettutor_token");
        setUser(null);
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("nettutor_token", data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem("nettutor_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("nettutor_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
