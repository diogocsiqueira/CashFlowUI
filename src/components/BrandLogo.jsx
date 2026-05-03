export default function BrandLogo({ compact = false, size = "default" }) {
  const isHero = size === "hero";

  return (
    <div
      className={[
        "flex items-center",
        compact ? "gap-3" : isHero ? "gap-5" : "gap-4",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex shrink-0 items-center justify-center overflow-hidden",
          "rounded-3xl border border-white/10",
          "bg-[#7DD3FC]",
          "shadow-[0_0_35px_rgba(125,211,252,0.18)]",
          isHero ? "h-24 w-24 xl:h-28 xl:w-28" : compact ? "h-12 w-12" : "h-16 w-16",
        ].join(" ")}
      >
        <img
          src="/ascenda-icon.png"
          alt="Ascenda"
          className={[
            "object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]",
            isHero ? "h-[76%] w-[76%]" : compact ? "h-[74%] w-[74%]" : "h-[76%] w-[76%]",
          ].join(" ")}
          draggable="false"
        />
      </div>

      {!compact && (
        <div>
          <h1
            className={[
              "font-black leading-none tracking-tight text-(--text)",
              isHero ? "text-6xl xl:text-7xl" : "text-3xl",
            ].join(" ")}
          >
            Ascenda
          </h1>

          <p
            className={[
              "font-semibold text-(--muted)",
              isHero ? "mt-3 text-base" : "mt-1 text-sm",
            ].join(" ")}
          >
            Controle hoje. Liberdade amanhã.
          </p>
        </div>
      )}
    </div>
  );
}