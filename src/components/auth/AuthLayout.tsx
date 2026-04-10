import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const DOTS = ["#FFC94B", "#A5C85A", "#5EC1E8", "#8B5FBF"] as const;
const FEEDBACK_PREVIEW = [
  {
    quote:
      "My son finally feels seen for the way he thinks, not only for the marks he brings home.",
    author: "Parent voice",
  },
  {
    quote:
      "I like that ideas become drafts, discussions, and real work instead of staying inside notebooks.",
    author: "Student voice",
  },
] as const;

export default function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_#60D3D7_0%,_#227C86_38%,_#113B45_100%)] p-12 lg:flex lg:w-5/12 lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_32%,rgba(255,201,75,0.16)_68%,rgba(165,200,90,0.12)_100%)]" />
        <div className="pointer-events-none absolute -left-16 -top-20 h-80 w-80 animate-[authFloat_14s_ease-in-out_infinite] rounded-full bg-[#5EC1E8]/30 blur-2xl" />
        <div className="pointer-events-none absolute right-[-5rem] top-20 h-72 w-72 animate-[authFloat_16s_ease-in-out_infinite_reverse] rounded-full bg-[#FFC94B]/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-[-7rem] left-10 h-[26rem] w-[26rem] animate-[authFloat_18s_ease-in-out_infinite] rounded-full bg-[#A5C85A]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 left-[18%] w-px bg-white/12" />
        <div className="pointer-events-none absolute inset-x-0 top-[22%] h-px bg-white/10" />
        <div className="pointer-events-none absolute left-[14%] top-[18%] h-24 w-24 rotate-12 rounded-[2rem] border border-white/12 bg-white/8 backdrop-blur-sm" />
        <div className="pointer-events-none absolute right-[14%] bottom-[18%] h-32 w-32 -rotate-12 rounded-[2.5rem] border border-white/12 bg-white/6 backdrop-blur-sm" />
        <div className="pointer-events-none absolute right-10 top-1/4 h-3 w-3 rounded-full bg-white/40 shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
        <div className="pointer-events-none absolute bottom-1/3 left-1/3 h-2.5 w-2.5 rounded-full bg-[#FFC94B]/70 shadow-[0_0_24px_rgba(255,201,75,0.7)]" />
        <div className="pointer-events-none absolute left-[46%] top-[62%] h-4 w-4 rounded-full bg-[#A5C85A]/60 shadow-[0_0_26px_rgba(165,200,90,0.7)]" />

        <style>{`
          @keyframes authFloat {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -18px, 0) scale(1.04);
            }
          }
        `}</style>

        <Link to="/" className="relative z-10 flex w-fit items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <span className="text-lg font-black text-white">F</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Mensa
          </span>
        </Link>

        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
            Intelligent Learning
          </div>
          <h1 className="text-4xl font-black leading-tight text-white">
            Exceptional minds.
            <br />
            <span className="text-[#FFC94B]">Intelligent futures.</span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/76">
            Enter a learning ecosystem where human potential meets Artificial
            Intelligence designed to cultivate thinkers, innovators, and future
            nation-builders.
          </p>
          <div className="flex gap-2 pt-2">
            {DOTS.map((c) => (
              <span
                key={c}
                className="block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/64">
                Feedback Draft
              </p>
              <h2 className="mt-2 text-xl font-black text-white">
                Parents and students
              </h2>
            </div>
            <div className="rounded-full border border-white/15 bg-[#FFC94B]/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFE4A1]">
              Homepage
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {FEEDBACK_PREVIEW.map((item) => (
              <article
                key={item.quote}
                className="rounded-[1.4rem] border border-white/10 bg-[#0F2730]/38 p-4"
              >
                <p className="text-sm leading-6 text-white/82">{item.quote}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/54">
                  {item.author}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-[linear-gradient(180deg,#FCFAF6_0%,#F6F1E8_100%)]">
        <header className="flex items-center justify-between px-6 py-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2CA4A4]">
              <span className="text-sm font-black text-white">F</span>
            </div>
            <span className="font-black text-[#2F3E3E]">Mensa</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-[#2F3E3E]/12 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2F3E3E] shadow-sm transition hover:border-[#2CA4A4]/35 hover:text-[#2CA4A4]"
          >
            Back to Main Page
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
