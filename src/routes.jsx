// src/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/useAuth";

export default function RoutesApp() {
  const { authed } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={authed ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={authed ? <Dashboard /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
