import React from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Eye,
  MapPin,
  Network,
  PlayCircle,
  Sparkles,
  ThumbsUp,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getPublishedBlogs,
  getPublishedBlogsAsync,
  getBlogStats,
  mergePublishedAndSeedBlogs,
  type BlogEntry,
} from "@/pages/dashboard/blogData";

const PublicBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [publishedBlogs, setPublishedBlogs] = React.useState<BlogEntry[]>(() =>
    getPublishedBlogs(),
  );
  const visibleBlogs = mergePublishedAndSeedBlogs(publishedBlogs);

  React.useEffect(() => {
    void getPublishedBlogsAsync().then(setPublishedBlogs);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="blogHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.38 }} />
                <stop offset="52%" style={{ stopColor: "#5EC1E8", stopOpacity: 0.24 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0.22 }} />
              </linearGradient>
              <radialGradient id="blogGlowTeal" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: "#2CA4A4", stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="blogGlowYellow" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#FFC94B", stopOpacity: 0.28 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0 }} />
              </radialGradient>
            </defs>

            <rect width="1200" height="900" fill="url(#blogHeroGradient)" opacity="0.55" />
            <circle cx="240" cy="220" r="150" fill="url(#blogGlowTeal)">
              <animate attributeName="r" values="150;190;150" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="980" cy="680" r="140" fill="url(#blogGlowYellow)">
              <animate attributeName="r" values="140;180;140" dur="9s" repeatCount="indefinite" />
            </circle>
            <path
              d="M 0,420 Q 260,350 520,420 T 1040,420 T 1300,420"
              stroke="#2CA4A4"
              strokeWidth="3"
              fill="none"
              opacity="0.32"
              strokeDasharray="14,12"
            >
              <animate
                attributeName="d"
                values="M 0,420 Q 260,350 520,420 T 1040,420 T 1300,420; M 0,420 Q 260,500 520,420 T 1040,420 T 1300,420; M 0,420 Q 260,350 520,420 T 1040,420 T 1300,420"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate attributeName="stroke-dashoffset" from="0" to="26" dur="2.5s" repeatCount="indefinite" />
            </path>
            {[...Array(20)].map((_, i) => {
              const x = (i * 97 + 72) % 1120;
              const y = (i * 71 + 96) % 780;
              const size = 7 + (i % 3) * 4;
              return (
                <polygon
                  key={`blog-star-${i}`}
                  points={`${x},${y - size} ${x + size * 0.3},${y - size * 0.3} ${x + size},${y} ${x + size * 0.3},${y + size * 0.3} ${x},${y + size} ${x - size * 0.3},${y + size * 0.3} ${x - size},${y} ${x - size * 0.3},${y - size * 0.3}`}
                  fill={i % 2 ? "#FFC94B" : "#5EC1E8"}
                  opacity="0.35"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur={`${5 + (i % 4)}s`}
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.18;0.62;0.18" dur={`${4 + (i % 5)}s`} repeatCount="indefinite" />
                </polygon>
              );
            })}
            {[...Array(18)].map((_, i) => (
              <circle
                key={`blog-dot-${i}`}
                cx={600 + Math.cos((i * 20 * Math.PI) / 180) * 310}
                cy={450 + Math.sin((i * 20 * Math.PI) / 180) * 260}
                r="4"
                fill="#8B5FBF"
                opacity="0.28"
              >
                <animate attributeName="r" values="4;8;4" dur="7s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fadeInUp">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2CA4A4]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2CA4A4] shadow-sm backdrop-blur">
              <Sparkles size={16} />
              Public Insights
            </div>
            <h1 className="text-4xl font-black leading-tight text-[#2F3E3E] sm:text-5xl lg:text-6xl">
              Blogs for intelligent futures.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#2F3E3E]/72">
              New essays and updates will appear here once they are ready to
              publish.
            </p>
          </div>

          <div className="mt-16 overflow-x-auto pb-8 pl-1 pr-4 blog-scrollbar">
            <div
              className={
                visibleBlogs.length === 0
                  ? "flex justify-center"
                  : "flex w-max gap-8"
              }
            >
            {visibleBlogs.length === 0 ? (
              <div className="w-[min(86vw,560px)] rounded-[2rem] border border-white/80 bg-white/92 p-8 text-center shadow-xl backdrop-blur">
                <h2 className="text-2xl font-black text-[#2F3E3E]">
                  No blogs published yet.
                </h2>
                <p className="mt-3 text-base leading-7 text-[#2F3E3E]/70">
                  Real blogs will appear here after they are added.
                </p>
              </div>
            ) : (
            visibleBlogs.map((blog, index) => {
              const hasYoutube = blog.content.some(
                (block) => typeof block !== "string" && block.type === "youtube",
              );
              const palettes = [
                {
                  glow: "from-[#2CA4A4] via-[#5EC1E8] to-[#FFC94B]",
                  chip: "bg-[#2CA4A4]/12 text-[#1E7C7C]",
                  blob: "bg-[#5EC1E8]/25",
                  accent: "bg-[#FFC94B]",
                },
                {
                  glow: "from-[#8B5FBF] via-[#5EC1E8] to-[#A5C85A]",
                  chip: "bg-[#8B5FBF]/12 text-[#6B4799]",
                  blob: "bg-[#8B5FBF]/25",
                  accent: "bg-[#A5C85A]",
                },
                {
                  glow: "from-[#FFC94B] via-[#A5C85A] to-[#2CA4A4]",
                  chip: "bg-[#A5C85A]/16 text-[#557127]",
                  blob: "bg-[#FFC94B]/25",
                  accent: "bg-[#5EC1E8]",
                },
                {
                  glow: "from-[#EC4899] via-[#8B5FBF] to-[#2CA4A4]",
                  chip: "bg-[#EC4899]/12 text-[#B82F72]",
                  blob: "bg-[#EC4899]/20",
                  accent: "bg-[#8B5FBF]",
                },
              ];
              const palette = palettes[index % palettes.length];
              const stats = getBlogStats(blog);

              return (
                <article
                  key={blog.slug}
                  className="group relative w-[min(86vw,430px)] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 shadow-xl backdrop-blur transition-all duration-700 hover:-translate-y-4 hover:rotate-[-1.25deg] hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${palette.glow}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${palette.glow} opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.13]`} />
                  <div className={`absolute -right-14 -top-14 h-40 w-40 rounded-full ${palette.blob} blur-2xl transition-transform duration-700 group-hover:scale-150`} />
                  <div className="absolute -left-10 bottom-12 h-28 w-28 rounded-full bg-[#2CA4A4]/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
                  <div className="absolute right-8 top-10 h-16 w-16 rotate-12 rounded-2xl border border-white/70 bg-white/30 transition-transform duration-700 group-hover:rotate-[32deg] group-hover:scale-110" />
                  <div className="relative p-4 pb-0">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/80 bg-[#F7FAFA] shadow-md transition-transform duration-700 group-hover:rotate-[2.25deg] group-hover:scale-[0.98]">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-115 group-hover:saturate-125"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.46)_46%,rgba(255,255,255,0)_62%)] translate-x-[-130%] transition-transform duration-1000 group-hover:translate-x-[130%]" />
                      <div className={`absolute bottom-4 right-4 h-12 w-12 rounded-2xl ${palette.accent} opacity-90 shadow-lg transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110`} />
                    </div>
                    {hasYoutube ? (
                      <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        <PlayCircle size={14} />
                        Includes video
                      </div>
                    ) : null}
                  </div>
                  <div className="relative p-7">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${palette.chip}`}>
                        <BookOpen size={14} />
                        Blog
                      </span>
                      <span className="text-xs font-medium text-[#2F3E3E]/50">
                        {blog.author}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight text-[#2F3E3E] transition-colors duration-300 group-hover:text-[#2CA4A4]">
                      {blog.title}
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[#2F3E3E]/70">
                      {blog.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/about-us/${blog.slug}`)}
                        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${palette.glow} px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-xl group-hover:translate-x-2`}
                      >
                        Read More
                        <ArrowRight size={16} />
                      </button>
                      <div className="ml-auto flex items-center gap-4 text-xs font-semibold text-[#2F3E3E]/48">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye size={14} className="text-[#2F3E3E]/38" />
                          {stats.views}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <ThumbsUp size={14} className="text-[#2F3E3E]/38" />
                          {stats.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out both;
        }

        .blog-scrollbar {
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: #2CA4A4 rgba(255, 255, 255, 0.5);
        }

        .blog-scrollbar::-webkit-scrollbar {
          height: 10px;
        }

        .blog-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.58);
          border-radius: 999px;
        }

        .blog-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #2CA4A4, #5EC1E8, #FFC94B);
          border-radius: 999px;
        }
      `}</style>
    </main>
  );
};

export default PublicBlogs;
