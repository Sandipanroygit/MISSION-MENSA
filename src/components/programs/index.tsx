import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DISCUSSION_CATEGORY_OPTIONS,
  formatDate,
  getDiscussionCategory,
  getPublicTopics,
  getPublicTopicsAsync,
  getTopicCoverImage,
  type DiscussionTopic,
} from "@/pages/dashboard/discussionData";

const topicAccents = [
  {
    bg: "bg-[#2CA4A4]",
    soft: "bg-[#2CA4A4]/12",
    text: "text-[#1E7C7C]",
    border: "border-[#2CA4A4]/28",
    gradient: "from-[#2CA4A4] to-[#5EC1E8]",
  },
  {
    bg: "bg-[#FFC94B]",
    soft: "bg-[#FFC94B]/18",
    text: "text-[#8A6412]",
    border: "border-[#FFC94B]/40",
    gradient: "from-[#FFC94B] to-[#A5C85A]",
  },
  {
    bg: "bg-[#8B5FBF]",
    soft: "bg-[#8B5FBF]/14",
    text: "text-[#68469A]",
    border: "border-[#8B5FBF]/30",
    gradient: "from-[#8B5FBF] to-[#EC4899]",
  },
];

const PublicDiscussions: React.FC = () => {
  const navigate = useNavigate();
  const initialTopics = useMemo(() => getPublicTopics(), []);
  const [topics, setTopics] = useState<DiscussionTopic[]>(initialTopics);
  const [selectedCategory, setSelectedCategory] = useState("All topics");
  const categoryOptions = useMemo(
    () => [
      "All topics",
      ...Array.from(
        new Set([
          ...DISCUSSION_CATEGORY_OPTIONS,
          ...topics.map((topic) => getDiscussionCategory(topic)),
        ]),
      ),
    ],
    [topics],
  );
  const visibleTopics = useMemo(
    () =>
      selectedCategory === "All topics"
        ? topics
        : topics.filter(
            (topic) => getDiscussionCategory(topic) === selectedCategory,
          ),
    [selectedCategory, topics],
  );

  useEffect(() => {
    void getPublicTopicsAsync().then(setTopics);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF7F2] text-[#2F3E3E]">
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="discussionProgramsBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.32 }} />
                <stop offset="48%" style={{ stopColor: "#5EC1E8", stopOpacity: 0.18 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0.28 }} />
              </linearGradient>
              <radialGradient id="discussionOrbA" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: "#2CA4A4", stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="discussionOrbB" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#FFC94B", stopOpacity: 0.34 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0 }} />
              </radialGradient>
            </defs>

            <rect width="1200" height="900" fill="url(#discussionProgramsBg)" opacity="0.72" />
            <circle cx="180" cy="170" r="150" fill="url(#discussionOrbA)">
              <animate attributeName="r" values="130;190;130" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="1010" cy="710" r="150" fill="url(#discussionOrbB)">
              <animate attributeName="r" values="140;205;140" dur="9s" repeatCount="indefinite" />
            </circle>
            <path
              d="M-80,430 Q220,330 520,430 T1120,430 T1420,430"
              fill="none"
              stroke="#2CA4A4"
              strokeDasharray="12,12"
              strokeWidth="4"
              opacity="0.28"
            >
              <animate
                attributeName="d"
                values="M-80,430 Q220,330 520,430 T1120,430 T1420,430;M-80,430 Q220,540 520,430 T1120,430 T1420,430;M-80,430 Q220,330 520,430 T1120,430 T1420,430"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.4s" repeatCount="indefinite" />
            </path>
            <path
              d="M-100,590 Q260,690 620,590 T1340,590"
              fill="none"
              stroke="#8B5FBF"
              strokeDasharray="8,16"
              strokeWidth="3"
              opacity="0.18"
            >
              <animate
                attributeName="d"
                values="M-100,590 Q260,690 620,590 T1340,590;M-100,590 Q260,500 620,590 T1340,590;M-100,590 Q260,690 620,590 T1340,590"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
            {[...Array(16)].map((_, i) => {
              const x = (i * 97 + 90) % 1110;
              const y = (i * 73 + 110) % 740;
              const color = ["#2CA4A4", "#FFC94B", "#5EC1E8", "#A5C85A"][i % 4];

              return (
                <g key={`program-discussion-bubble-${i}`} opacity="0.42">
                  <rect x={x} y={y} width={44} height={28} rx={14} fill={color}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0; 0 -22; 0 0"
                      dur={`${5 + (i % 5)}s`}
                      repeatCount="indefinite"
                    />
                  </rect>
                  <circle cx={x + 14} cy={y + 14} r="2.3" fill="#2F3E3E" opacity="0.42" />
                  <circle cx={x + 22} cy={y + 14} r="2.3" fill="#2F3E3E" opacity="0.42" />
                  <circle cx={x + 30} cy={y + 14} r="2.3" fill="#2F3E3E" opacity="0.42" />
                </g>
              );
            })}
            {[...Array(18)].map((_, i) => {
              const cx = (i * 83 + 70) % 1140;
              const cy = (i * 59 + 75) % 790;

              return (
                <circle
                  key={`program-discussion-dot-${i}`}
                  cx={cx}
                  cy={cy}
                  r={3 + (i % 3)}
                  fill={i % 2 ? "#8B5FBF" : "#2CA4A4"}
                  opacity="0.32"
                >
                  <animate attributeName="r" values="3;8;3" dur={`${4 + (i % 4)}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.18;0.52;0.18" dur={`${4 + (i % 4)}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-discussionRise">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2CA4A4]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2CA4A4] shadow-sm backdrop-blur">
                <Sparkles size={16} />
                Public Discussion Board
              </div>
              <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#2F3E3E] sm:text-6xl lg:text-7xl">
                Ideas do not sit still here.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#2F3E3E]/72">
                Read discussions, follow different views, and join the thread
                after signing in. The layout is built like an open forum, not a
                course catalogue.
              </p>
          </div>

          <div className="mt-12 rounded-[2.5rem] border border-white/70 bg-white/82 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#FFC94B]">
                  Discussions
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#2F3E3E]">
                  Pick a conversation.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#2F3E3E]/62">
                Public readers can view every thread. Comments unlock after
                login from inside the discussion.
              </p>
            </div>

            <div className="mb-7 flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    selectedCategory === category
                      ? "border-[#2CA4A4] bg-[#2CA4A4] text-white shadow-lg"
                      : "border-[#2CA4A4]/18 bg-white/80 text-[#2F3E3E]/72 hover:border-[#2CA4A4]/55 hover:text-[#2F3E3E]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {visibleTopics.length ? (
              <div className="grid gap-5 lg:grid-cols-3">
                {visibleTopics.map((topic, index) => {
                const accent = topicAccents[index % topicAccents.length];

                return (
                  <article
                    key={topic.id}
                    className={`group relative flex min-h-[460px] flex-col overflow-hidden rounded-[2rem] border ${accent.border} bg-[#F8F2E8] text-[#172222] shadow-xl transition duration-500 hover:-translate-y-3 hover:rotate-[-0.7deg] hover:shadow-2xl`}
                  >
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
                    <div className={`absolute right-5 top-5 h-16 w-16 rounded-[1.25rem] ${accent.bg} opacity-90 transition duration-500 group-hover:rotate-45 group-hover:scale-110`} />
                    <div className="relative flex flex-1 flex-col p-5">
                      <div className="relative aspect-[1.15/1] overflow-hidden rounded-[1.6rem] border border-white/70 shadow-md">
                        <img
                          src={getTopicCoverImage(topic)}
                          alt={topic.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#172222] shadow-sm">
                          <MessageCircle size={14} className={accent.text} />
                          {topic.comments.length} replies
                        </div>
                      </div>

                      <div className="mt-6 min-w-0 flex-1">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ${accent.soft} ${accent.text}`}>
                            {getDiscussionCategory(topic)}
                          </span>
                          <span className="min-w-0 truncate text-xs font-semibold text-[#172222]/50">
                            {formatDate(topic.createdAt)}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 break-words text-xl font-black leading-tight tracking-[-0.02em] text-[#172222]">
                          {topic.title}
                        </h3>
                        <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-[#172222]/68">
                          {topic.body}
                        </p>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => navigate(`/programs/${topic.id}`)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-gradient-to-r ${accent.gradient} px-5 py-4 text-sm font-black text-white shadow-lg transition duration-300 group-hover:translate-y-[-2px]`}
                        >
                          <span className="min-w-0 truncate">View Discussion</span>
                          <ArrowUpRight size={18} className="shrink-0" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[#2CA4A4]/28 bg-white/78 px-6 py-14 text-center shadow-lg">
                <h3 className="text-2xl font-black text-[#2F3E3E]">
                  No discussions here yet.
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#2F3E3E]/62">
                  Choose All topics or create a new discussion for this area
                  after signing in.
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Public reading", "Everyone can open the topics."],
              ["Member replies", "Login is required before commenting."],
              ["Media friendly", "Replies can include images and videos."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-white/70 bg-white/78 p-5 shadow-lg backdrop-blur"
              >
                <UsersRound size={18} className="text-[#FFC94B]" />
                <h3 className="mt-3 text-base font-black text-[#2F3E3E]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#2F3E3E]/62">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes discussionRise {
          from {
            opacity: 0;
            transform: translateY(26px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-discussionRise {
          animation: discussionRise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </main>
  );
};

export default PublicDiscussions;
