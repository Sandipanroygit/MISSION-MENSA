import { ArrowLeft, PlayCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  blogs,
  getPublishedBlogs,
  getPublishedBlogsAsync,
  type BlogEntry,
  type BlogYoutubeBlock,
} from "./dashboard/blogData";
import ScrollToTop from "@/components/common/ScrolltoTop";
import InlineRichText from "@/components/common/InlineRichText";

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

function PublicYouTubeBlock({
  block,
  isPlaying,
  onPlay,
}: {
  block: BlogYoutubeBlock;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const videoId = getYouTubeVideoId(block.url);

  if (!videoId) {
    return (
      <a
        href={block.url}
        target="_blank"
        rel="noreferrer"
        className="block rounded-[1.75rem] border border-[#E3EAEA] bg-white/80 p-5 text-sm font-medium text-[#2CA4A4]"
      >
        {block.title}
      </a>
    );
  }

  if (isPlaying) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-[#E3EAEA] bg-black shadow-xl">
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={block.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group block w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white text-left shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={block.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.42)_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white/92 px-5 py-3 text-sm font-bold text-[#2F3E3E] shadow-lg">
            <PlayCircle size={20} className="text-[#E53935]" />
            Play video here
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
          YouTube
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#2F3E3E]">{block.title}</h3>
      </div>
    </button>
  );
}

export default function PublicBlogReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [publishedBlogs, setPublishedBlogs] = useState<BlogEntry[]>(() =>
    getPublishedBlogs(),
  );
  const blog = [...publishedBlogs, ...blogs].find(
    (entry) => entry.slug === slug,
  );

  useEffect(() => {
    void getPublishedBlogsAsync().then(setPublishedBlogs);
  }, []);

  if (!blog) {
    return <Navigate to="/about-us" replace />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF7F2]">
      <ScrollToTop />
      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 top-8 h-80 w-80 rounded-full bg-[#5EC1E8]/18 blur-3xl animate-pulse" />
          <div className="absolute right-[-6rem] top-80 h-96 w-96 rounded-full bg-[#FFC94B]/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#A5C85A]/18 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/about-us"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2CA4A4]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2F3E3E] shadow-sm backdrop-blur transition hover:border-[#2CA4A4]/50 hover:text-[#2CA4A4]"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>

          <article className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/92 shadow-2xl backdrop-blur">
            <div className="relative">
              <img
                src={blog.image}
                alt={blog.title}
                className="max-h-[520px] w-full bg-[#F7FAFA] object-contain"
              />
              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles size={16} />
                Public Blog
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
                Mission MENSA Insights
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-[#2F3E3E] sm:text-5xl">
                {blog.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#2F3E3E]/68">
                {blog.summary}
              </p>
              <p className="mt-6 text-sm font-semibold text-[#2CA4A4]">
                Written by {blog.author}
              </p>

              <div className="mt-10 space-y-8 text-lg leading-9 text-[#2F3E3E]/82">
                {blog.content.map((block, index) => {
                  if (typeof block === "string") {
                    return (
                      <p key={`${blog.slug}-paragraph-${index}`}>
                        <InlineRichText text={block} />
                      </p>
                    );
                  }

                  return (
                    <PublicYouTubeBlock
                      key={`${blog.slug}-youtube-${index}`}
                      block={block}
                      isPlaying={activeVideoIndex === index}
                      onPlay={() => setActiveVideoIndex(index)}
                    />
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
