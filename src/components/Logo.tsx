import { Link } from "react-router-dom";
import clsx from "clsx";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeMap = {
    sm: { mono: "h-7 w-7 text-sm", name: "text-base" },
    md: { mono: "h-9 w-9 text-base", name: "text-xl" },
    lg: { mono: "h-11 w-11 text-lg", name: "text-2xl" },
  } as const;

  return (
    <Link to="/" className={clsx("flex items-center gap-3 group", className)}>
      <span
        className={clsx(
          "inline-flex items-center justify-center rounded-xl border border-white/10",
          "bg-gradient-to-br from-cyan-500/20 via-sky-400/10 to-fuchsia-400/20",
          "shadow-[0_0_24px_rgba(56,189,248,0.15)] backdrop-blur-sm",
          sizeMap[size].mono
        )}
      >
        <span className="font-orbitron font-bold tracking-widest bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
          HM
        </span>
      </span>
      <span
        className={clsx(
          "font-orbitron font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent",
          "drop-shadow-[0_0_10px_rgba(56,189,248,0.35)] transition-all duration-300",
          "group-hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.45)]",
          sizeMap[size].name
        )}
      >
        Hamdi Mohammed
      </span>
    </Link>
  );
};
