import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { initTheme } = useTheme();

  useEffect(() => {
    initTheme();
  }, []);

  return <Dashboard />;
}
