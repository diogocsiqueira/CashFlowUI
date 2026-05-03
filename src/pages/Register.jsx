import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useTheme } from "../hooks/useTheme";
import BrandLogo from "../components/BrandLogo";
import GoatMascot from "../components/GoatMascot";

export default function Register() {
  const nav = useNavigate();
  const { initTheme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mascotState, setMascotState] = useState("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    initTheme();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMascotState("idle");

    try {
      await authApi.register({ email, password });
      nav("/login", { replace: true });
    } catch (e) {
      setMascotState("error");
      setError(e?.response?.data?.message || "Erro no cadastro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-(--bg) text-(--text) lg:grid-cols-2 animate-fade-in">

      {/* ESQUERDA */}
      <div className="relative hidden min-h-screen flex-col overflow-hidden bg-(--surface-soft) p-10 lg:flex">
        <button
          onClick={toggleTheme}
          className="absolute right-6 top-6 z-20 rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm shadow-(--shadow)"
        >
          🌓
        </button>

        <div className="relative z-10 flex h-full flex-col">
          <BrandLogo size="hero" />

          <div className="mt-10 max-w-xl">
            <h2 className="text-5xl font-black leading-tight">
              Comece sua subida.
            </h2>

            <p className="mt-4 text-lg text-(--muted)">
              Controle financeiro não é sobre números — é sobre liberdade.
            </p>
          </div>

          <div className="mt-auto pb-6 pt-10">
            <GoatMascot state={mascotState} variant="hero" />
          </div>
        </div>
      </div>

      {/* DIREITA */}
      <div className="relative flex items-center justify-center p-6">
        <button
          onClick={toggleTheme}
          className="absolute right-5 top-5 rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm shadow-(--shadow) lg:hidden"
        >
          🌓
        </button>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl border border-(--border) bg-(--surface) p-8 shadow-(--shadow) animate-slide-up"
        >
          <div className="mb-6 lg:hidden">
            <BrandLogo compact />
          </div>

          <h2 className="text-2xl font-black">Criar conta</h2>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="mt-6">
            <label className="text-sm font-bold">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-(--border) bg-(--surface-soft) px-4 py-3 outline-none focus:ring-2 focus:ring-(--brand-primary)"
              value={email}
              onFocus={() => setMascotState("watching")}
              onBlur={() => setMascotState("idle")}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4 relative">
            <label className="text-sm font-bold">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-2 w-full rounded-xl border border-(--border) bg-(--surface-soft) px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-(--brand-primary)"
              value={password}
              onFocus={() => setMascotState("password")}
              onBlur={() => setMascotState("idle")}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[42px] text-sm text-(--muted)"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-(--btn-bg) py-3 font-bold text-(--btn-text)"
          >
            {busy ? "Criando..." : "Criar conta"}
          </button>

          <p className="mt-4 text-sm text-(--muted)">
            Já tem conta?{" "}
            <Link to="/login" className="font-bold text-(--brand-primary)">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}