import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { toggleTheme } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId, setDeviceId] = useState("web");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login({ email, password, deviceId }); // <-- reativo
      // sem navigate aqui
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Falha no login");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) flex items-center justify-center px-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-lg border border-(--border) bg-(--surface)
                   px-2 py-1 text-xs shadow-sm hover:bg-black/5 transition"
        title="Alternar tema"
      >
        🌓
      </button>

      <div className="w-full max-w-sm rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <div className="text-xl font-semibold">Entrar</div>
        <div className="mt-1 text-sm text-(--muted)">Acesse sua conta</div>

        {error && (
          <div className="mt-4 rounded-2xl border border-(--border) bg-(--surface) p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1">
            <span className="text-xs text-(--muted)">Email</span>
            <input
              className="rounded-2xl border border-(--border) bg-transparent px-3 py-2 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-(--muted)">Senha</span>
            <input
              className="rounded-2xl border border-(--border) bg-transparent px-3 py-2 outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-(--muted)">deviceId (opcional)</span>
            <input
              className="rounded-2xl border border-(--border) bg-transparent px-3 py-2 outline-none"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            />
          </label>

          <button
            disabled={busy}
            className="mt-2 rounded-2xl bg-[#111] text-white py-2 font-semibold
                       hover:bg-black active:scale-[0.99] transition disabled:opacity-60"
          >
            {busy ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-sm text-(--muted)">
          Não tem conta?{" "}
          <Link className="text-(--text) underline" to="/register">
            Criar agora
          </Link>
        </div>
      </div>
    </div>
  );
}
