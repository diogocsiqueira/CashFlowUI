import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const nav = useNavigate();
  const { initTheme, toggleTheme, isDark } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceId] = useState("web");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const goatImage = isDark ? "/goat-dark.png" : "/goat-light.png";

  const cardText = isDark ? "#0C0726" : "#CED6DB";
  const heroTitle = isDark ? "#CED6DB" : "#1A1A4A";
  const heroSubtitle = isDark ? "#CED6DB" : "#0C0726";
  const buttonBg = isDark ? "#0C0726" : "#CED6DB";
  const buttonText = isDark ? "#CED6DB" : "#0C0726";

  useEffect(() => {
    initTheme();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await login({ email, password, deviceId });
      nav("/", { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Falha no login");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden font-(--font-body) animate-fade-in"
      style={{
        background: isDark
          ? "linear-gradient(90deg, #0C0726 0%, #09031F 48%, #04010F 76%, #000001 100%)"
          : "linear-gradient(180deg, #D8DEE2 0%, #D3DADF 38%, #CED6DB 72%, #C7D0D6 100%)",
        color: isDark ? "#CED6DB" : "#0C0726",
      }}
    >
      {/* ESCURECIMENTO SUAVE LADO DIREITO */}
      {isDark && (
        <div
          className="pointer-events-none absolute right-0 top-0 z-1 h-full w-[43%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.16) 40%, rgba(4,1,15,.24) 100%)",
          }}
        />
      )}

      {/* LOGO */}
      <img
        src="/ascenda-icon.png"
        alt="Ascenda"
        className="absolute left-5 top-3.5 z-30 w-51.25 select-none object-contain"
        draggable="false"
      />

      {/* BODE COMO FUNDO */}
      <img
        src={goatImage}
        alt=""
        className="pointer-events-none absolute z-0 hidden select-none object-contain lg:block"
       style={{
          width: "clamp(820px, 68vw, 1080px)",
          left: "15%",
          top: isDark ? "11%" : "12%",
          opacity: isDark ? 0.9 : 0.72,
        }}
        draggable="false"
      />

      {/* FADE INFERIOR */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[42%]"
        style={{
          background: isDark
            ? "linear-gradient(0deg, #0C0726 0%, rgba(12,7,38,.72) 32%, transparent 100%)"
            : "linear-gradient(0deg, #CED6DB 0%, rgba(206,214,219,.86) 38%, transparent 100%)",
        }}
      />

      {/* TEXTO HERO */}
      <section className="absolute bottom-12 left-7 z-10 hidden lg:block">
        <h1
          className="text-[39px] font-medium leading-[1.4] tracking-normal"
          style={{ color: heroTitle }}
        >
          Suba um nível na
          <br />
          sua vida financeira
        </h1>

        <p
          className="-mt-1 text-[19px] font-extralight leading-[1.4]"
          style={{ color: heroSubtitle }}
        >
          organize sua grana e acompanhe sua evolução
        </p>
      </section>

      {/* CARD LOGIN */}
      <section
        className="
          relative
          z-20
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-24

          lg:flex
          lg:items-center
          lg:justify-end
          lg:px-[5vw]
          lg:py-0
        "
      >
        <form
          onSubmit={onSubmit}
          className="
            relative
            w-full
            max-w-111.25
            rounded-[10px]
            px-13.5
            pb-13.5
            pt-[108px]

            lg:absolute
            lg:right-[5.5vw]
            lg:top-1/2
            lg:h-[590px]
            lg:w-111.25
            lg:-translate-y-1/2
          "
          style={{
            background: "#5F6F92",
            color: cardText,

            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,.10)"
              : "0 4px 10px rgba(55,64,110,.08)",
          }}
        >
          {/* TEMA */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="absolute right-3.5 top-3 h-8.5 w-8.5 overflow-hidden rounded-full transition hover:scale-105 active:scale-95"
          >
            <img
              src="/theme-button.jpeg"
              alt=""
              className="h-full w-full object-cover"
              draggable="false"
            />
          </button>

          {/* TITULO */}
          <h2
            className="mb-10.5 text-center text-[27px] font-bold leading-none"
            style={{ color: cardText }}
          >
            Seja bem-vindo(a)
          </h2>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-100">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <label
            className="block text-[15px] font-bold leading-none tracking-[-0.046em]"
            style={{ color: cardText }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-4.5 w-full border-0 border-b-2 bg-transparent px-0 pb-2 pt-0 text-[15px] font-medium outline-none"
            style={{
              color: cardText,
              borderColor: cardText,
            }}
          />

          {/* SENHA */}
          <label
            className="mt-8.5 block text-[15px] font-bold leading-none tracking-[-0.046em]"
            style={{ color: cardText }}
          >
            Senha
          </label>

          <div className="relative mt-4.5">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border-0 border-b-2 bg-transparent px-0 pb-2 pr-10 pt-0 text-[15px] font-medium outline-none"
              style={{
                color: cardText,
                borderColor: cardText,
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-0 -top-2 flex h-7 w-7 items-center justify-center"
              style={{ color: cardText }}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* LINKS */}
          <div
            className="mt-7.5 flex items-center justify-between text-[10px] leading-none tracking-[-0.046em]"
            style={{ color: cardText }}
          >
            <p>
              Não tem conta?{" "}
              <Link to="/register" className="font-bold hover:underline">
                Criar conta
              </Link>
            </p>

            <button
              type="button"
              className="font-bold hover:underline"
              onClick={() =>
                setError("Recuperação de senha ainda não foi implementada.")
              }
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={busy}
            className="mt-9.75 h-12 w-full rounded-full text-[18px] font-bold leading-none tracking-[-0.046em] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: buttonBg,
              color: buttonText,
            }}
          >
            {busy ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}