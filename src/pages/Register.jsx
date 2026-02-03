import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useTheme } from "../hooks/useTheme";
import { useEffect } from "react";

export default function Register() {
  const nav = useNavigate();
  const { toggleTheme, initTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  

useEffect(() => {
  initTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authApi.register({ email, password });
      nav("/login", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Falha no cadastro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) flex items-center justify-center px-4 relative">
      {/* 🔘 Botão de tema (overlay, não afeta layout) */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-lg border border-(--border) bg-(--surface)
                   px-2 py-1 text-xs shadow-sm hover:bg-black/5 transition"
        title="Alternar tema"
      >
        🌓
      </button>

      <div className="w-full max-w-sm rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <div className="text-xl font-semibold">Criar conta</div>
        <div className="mt-1 text-sm text-(--muted)">Registro rápido</div>

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
              autoComplete="new-password"
              required
            />
          </label>

          <button
            disabled={busy}
            className="mt-2 rounded-2xl bg-[#111] text-white py-2 font-semibold hover:bg-black active:scale-[0.99] transition disabled:opacity-60"
          >
            {busy ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-4 text-sm text-(--muted)">
          Já tem conta?{" "}
          <Link className="text-(--text) underline" to="/login">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
