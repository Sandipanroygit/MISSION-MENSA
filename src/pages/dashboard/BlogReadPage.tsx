import { ArrowLeft, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import InlineRichText from "@/components/common/InlineRichText";
import {
  blogs,
  deletePublishedBlog,
  deletePublishedBlogAsync,
  getPublishedBlogs,
  getPublishedBlogsAsync,
  type BlogEntry,
  type BlogYoutubeBlock,
} from "./blogData";

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

function YouTubeEmbed({
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
        className="block rounded-[1.75rem] border border-[#E3EAEA] bg-[#F7FAFA] p-5 text-sm font-medium text-[#2CA4A4]"
      >
        {block.title}
      </a>
    );
  }

  if (isPlaying) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-[#E3EAEA] bg-black shadow-sm">
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
      className="group block w-full overflow-hidden rounded-[1.75rem] border border-[#E3EAEA] bg-[#F7FAFA] text-left shadow-sm transition hover:border-[#2CA4A4]/30"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={block.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-[#1F2D2D] shadow-sm">
            <PlayCircle size={18} className="text-[#E53935]" />
            Play video
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
          YouTube
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[#2F3E3E]">
          {block.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{block.url}</p>
      </div>
    </button>
  );
}

export default function BlogReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();
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
    return <Navigate to="/dashboard/writing-blogs" replace />;
  }

  const canEdit =
    user?.email?.trim().toLowerCase() === blog.authorEmail.trim().toLowerCase();

  function handleDeleteBlog() {
    deletePublishedBlog(blog.slug);
    void deletePublishedBlogAsync(blog.slug).finally(() => {
      navigate("/dashboard/writing-blogs");
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/dashboard/writing-blogs"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#2F3E3E] transition hover:border-[#2CA4A4]/35 hover:text-[#2CA4A4]"
      >
        <ArrowLeft size={16} />
        Back to Blogs
      </Link>

      <article className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
        <img
          src={blog.image}
          alt={blog.title}
          className="max-h-[460px] w-full object-contain bg-[#F7FAFA]"
        />

        <div className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
            Blog
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#2F3E3E] sm:text-4xl">
            {blog.title}
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-500">
            {blog.summary}
          </p>
          <p className="mt-6 text-sm font-medium text-[#2CA4A4]">
            Written by {blog.author}
          </p>

          <div className="mt-8 space-y-8 text-base leading-8 text-[#2F3E3E]/85">
            {blog.content.map((block, index) => {
              if (typeof block === "string") {
                return (
                  <p key={`${blog.slug}-paragraph-${index}`}>
                    <InlineRichText text={block} />
                  </p>
                );
              }

              return (
                <YouTubeEmbed
                  key={`${blog.slug}-youtube-${index}`}
                  block={block}
                  isPlaying={activeVideoIndex === index}
                  onPlay={() => setActiveVideoIndex(index)}
                />
              );
            })}
          </div>

          <div className="mt-10 flex gap-3">
            <Link
              to={`/dashboard/writing-blogs/read/${blog.slug}`}
              className="rounded-full bg-[#2F3E3E] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Reading View
            </Link>
            {canEdit ? (
              <>
                <Link
                  to="/dashboard/writing-blogs/new"
                  className="rounded-full border border-[#2CA4A4]/30 px-5 py-2.5 text-sm font-semibold text-[#2CA4A4] transition hover:bg-[#2CA4A4]/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteBlog}
                  className="rounded-full bg-[#9A3D3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7F3030]"
                >
                  Delete
                </button>
              </>
            ) : (
              <span className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-400">
                Read Only
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
