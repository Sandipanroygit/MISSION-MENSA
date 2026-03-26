import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const DOTS = ["#FFC94B", "#A5C85A", "#5EC1E8", "#8B5FBF"] as const;

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: Brand Panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 bg-[#2CA4A4] overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#5EC1E8] opacity-25 pointer-events-none" />
        <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-[#A5C85A] opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 h-40 w-40 rounded-full bg-[#FFC94B] opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 right-8 h-6 w-6 rounded-full bg-white opacity-20 pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 h-3 w-3 rounded-full bg-[#FFC94B] opacity-40 pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <span className="text-lg font-black text-white">F</span>
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            FinWit <span className="text-[#FFC94B]">Kids</span>
          </span>
        </Link>

        {/* Headline */}
        <div className="relative z-10 space-y-5">
          <h1 className="text-4xl font-black text-white leading-tight">
            Smart kids,
            <br />
            <span className="text-[#FFC94B]">bright futures.</span>
          </h1>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            Build lifelong money habits through fun, age-appropriate learning
            adventures designed for every child.
          </p>
          <div className="flex gap-2 pt-2">
            {DOTS.map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 rounded-full block"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/40 text-xs">
          © {new Date().getFullYear()} FinWit Kids. All rights reserved.
        </p>
      </div>

      {/* ── Right: Form Panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col bg-[#FAF7F2]">
        {/* Mobile-only top bar */}
        <header className="flex items-center px-6 py-5 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2CA4A4]">
              <span className="text-sm font-black text-white">F</span>
            </div>
            <span className="font-black text-[#2F3E3E]">
              FinWit <span className="text-[#2CA4A4]">Kids</span>
            </span>
          </Link>
        </header>

        {/* Centered form slot */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
