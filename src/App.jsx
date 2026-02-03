// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import { useTheme } from "./hooks/useTheme";
import AuthProvider from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";

function AppInner() {
  const { ready } = useAuth();
  if (!ready) return null; // ou um loading

  return <RoutesApp />;
}

export default function App() {
  const { initTheme } = useTheme();

  useEffect(() => {
    initTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
