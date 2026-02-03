// src/auth/AuthProvider.jsx
import { createContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(!!getAccessToken());

  useEffect(() => {
    (async () => {
      try {
        if (!getAccessToken()) {
          const data = await authApi.refresh();

          const accessToken =
            data?.accessToken || data?.access_token || data?.token;

          if (accessToken) setAccessToken(accessToken);
        }
      } catch (e) {
        clearAccessToken();
      } finally {
        setAuthed(!!getAccessToken());
        setReady(true);
      }
    })();
  }, []);

  async function login(payload) {
    const data = await authApi.login(payload);

    const accessToken =
      data?.accessToken || data?.access_token || data?.token;

    if (accessToken) setAccessToken(accessToken);
    setAuthed(true);

    return data;
  }

  async function logout() {
    try {
      await authApi.logout?.();
    } finally {
      clearAccessToken();
      setAuthed(false);
    }
  }

  return (
    <AuthContext.Provider value={{ ready, authed, setAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
