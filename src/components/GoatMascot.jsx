export default function GoatMascot({ state = "idle", variant = "default" }) {
  const isHero = variant === "hero";
  const isPassword = state === "password";
  const isError = state === "error";
  const isWatching = state === "watching";

  return (
    <div className={isHero ? "relative mx-auto w-full max-w-lg" : "relative mx-auto w-full max-w-xs"}>
      <div className="absolute inset-x-8 top-10 h-20 rounded-full bg-(--brand-secondary)/10 blur-2xl" />

      <div
        className={[
          "relative rounded-[2rem] border border-(--border) bg-(--surface) p-6 shadow-(--shadow)",
          isError ? "animate-shake" : "animate-float",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex items-center justify-center rounded-full bg-(--surface-soft)",
            isHero ? "h-64 w-64" : "h-36 w-36",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 160 160"
            className={isHero ? "h-56 w-56" : "h-32 w-32"}
            fill="none"
          >
            {/* horns */}
            <path d="M45 54C26 39 31 19 51 25" stroke="var(--brand-accent)" strokeWidth="10" strokeLinecap="round" />
            <path d="M115 54C134 39 129 19 109 25" stroke="var(--brand-accent)" strokeWidth="10" strokeLinecap="round" />

            {/* head */}
            <path
              d="M43 62C45 35 115 35 117 62C121 105 104 132 80 132C56 132 39 105 43 62Z"
              fill="var(--surface)"
              stroke="var(--text)"
              strokeWidth="5"
            />

            {/* eyes */}
            {isPassword ? (
              <>
                <path d="M57 78C63 83 69 83 75 78" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" />
                <path d="M85 78C91 83 97 83 103 78" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx={isWatching ? 62 : 66} cy="78" r="6" fill="var(--text)" />
                <circle cx={isWatching ? 90 : 94} cy="78" r="6" fill="var(--text)" />
              </>
            )}

            {/* mouth */}
            <path
              d={isError ? "M69 119C76 113 84 113 91 119" : "M69 116C76 122 84 122 91 116"}
              stroke="var(--text)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm font-black">
            {isPassword
              ? "Segredo protegido."
              : isError
              ? "Confere isso aí."
              : isWatching
              ? "Tô de olho 👀"
              : "Bora subir?"}
          </p>
        </div>
      </div>
    </div>
  );
}