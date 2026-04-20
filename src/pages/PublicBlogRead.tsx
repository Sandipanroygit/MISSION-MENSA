import {
  ArrowLeft,
  Eye,
  FileText,
  MessageCircle,
  PlayCircle,
  Send,
  Sparkles,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  getBlogStats,
  getPublishedBlogs,
  getPublishedBlogsAsync,
  incrementBlogView,
  mergePublishedAndSeedBlogs,
  addBlogComment,
  deleteBlogComment,
  savePublishedBlogAsync,
  toggleBlogLike,
  type BlogEntry,
  type BlogHeadingBlock,
  type BlogPdfBlock,
  type BlogTableBlock,
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

function PublicPdfBlock({ block }: { block: BlogPdfBlock }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#E3EAEA] bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3EAEA] bg-[#F7FAFA] p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
            PDF Report
          </p>
          <h3 className="mt-2 text-xl font-bold text-[#2F3E3E]">
            {block.title}
          </h3>
        </div>
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#2F3E3E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2CA4A4]"
        >
          <FileText size={18} />
          Open PDF
        </a>
      </div>
      <iframe
        src={block.url}
        title={block.title}
        className="h-[72vh] min-h-[640px] w-full bg-[#F7FAFA]"
      />
    </div>
  );
}

function PublicHeadingBlock({ block }: { block: BlogHeadingBlock }) {
  const weightClasses =
    block.level === 1
      ? "text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#2F3E3E]"
      : block.level === 2
      ? "text-2xl sm:text-3xl font-serif font-bold text-[#2F3E3E]/92"
      : "text-xl font-semibold text-[#2F3E3E]/88";

  return (
    <p className={`mt-10 ${weightClasses}`}>{block.text}</p>
  );
}

function PublicTableBlock({ block }: { block: BlogTableBlock }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#DCE8E8] bg-white shadow-lg">
      <div className="border-b border-[#DCE8E8] bg-[#F7FAFA] px-5 py-4 sm:px-6">
        <h3 className="text-xl font-black text-[#2F3E3E]">{block.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm leading-6 text-[#2F3E3E]">
          <thead>
            <tr className="bg-[#2F3E3E] text-white">
              {block.headers.map((header) => (
                <th
                  key={header || "comparison-point"}
                  scope="col"
                  className="border-r border-white/15 px-5 py-4 text-sm font-bold last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr
                key={`${block.title}-${row[0]}`}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#F7FAFA]"}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${block.title}-${row[0]}-${cellIndex}`}
                    className={`border-r border-t border-[#DCE8E8] px-5 py-4 align-top last:border-r-0 ${
                      cellIndex === 0
                        ? "font-black text-[#2CA4A4]"
                        : "font-medium text-[#2F3E3E]/82"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PublicBlogReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthContext();
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const hasTrackedViewRef = useRef<string | null>(null);
  const [publishedBlogs, setPublishedBlogs] = useState<BlogEntry[]>(() =>
    getPublishedBlogs(),
  );
  const blog = mergePublishedAndSeedBlogs(publishedBlogs).find(
    (entry) => entry.slug === slug,
  );

  useEffect(() => {
    void getPublishedBlogsAsync().then(setPublishedBlogs);
  }, []);

  useEffect(() => {
    if (!slug || hasTrackedViewRef.current === slug) return;

    hasTrackedViewRef.current = slug;
    const updatedBlog = incrementBlogView(slug);
    if (updatedBlog) {
      setPublishedBlogs(getPublishedBlogs());
      void savePublishedBlogAsync(updatedBlog).then(() => {
        setPublishedBlogs(getPublishedBlogs());
      });
    }
  }, [slug]);

  if (!blog) {
    return <Navigate to="/about-us" replace />;
  }

  const stats = getBlogStats(blog);
  const isLikedByUser = Boolean(
    user?.email &&
      blog.likedBy?.includes(user.email.trim().toLowerCase()),
  );

  function handleToggleLike() {
    if (!user?.email) return;

    const updatedBlog = toggleBlogLike(blog.slug, user.email);
    if (updatedBlog) {
      setPublishedBlogs(getPublishedBlogs());
      void savePublishedBlogAsync(updatedBlog).then(() => {
        setPublishedBlogs(getPublishedBlogs());
      });
    }
  }

  function handlePostComment() {
    if (!user?.email || !commentBody.trim()) return;

    const updatedBlog = addBlogComment(blog.slug, {
      authorName: user.name || "User",
      authorEmail: user.email,
      body: commentBody,
    });

    if (updatedBlog) {
      setCommentBody("");
      setPublishedBlogs(getPublishedBlogs());
      void savePublishedBlogAsync(updatedBlog).then(() => {
        setPublishedBlogs(getPublishedBlogs());
      });
    }
  }

  function handleDeleteComment(commentId: string) {
    if (!user?.email) return;

    const updatedBlog = deleteBlogComment(blog.slug, commentId, user.email);
    if (updatedBlog) {
      setPublishedBlogs(getPublishedBlogs());
      void savePublishedBlogAsync(updatedBlog).then(() => {
        setPublishedBlogs(getPublishedBlogs());
      });
    }
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
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#2F3E3E]/70">
                <span className="inline-flex items-center gap-2">
                  <Eye size={16} className="text-[#2F3E3E]/50" />
                  {stats.views} views
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#2F3E3E]/50" />
                  {stats.comments} comments
                </span>
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={!user?.email}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${
                    user?.email
                      ? isLikedByUser
                        ? "bg-[#2CA4A4] text-white"
                        : "border border-[#2CA4A4]/30 text-[#2CA4A4] hover:bg-[#2CA4A4]/10"
                      : "cursor-not-allowed border border-gray-200 text-gray-400"
                  }`}
                >
                  <ThumbsUp size={16} />
                  {stats.likes} likes
                </button>
                {!user?.email && (
                  <span className="text-xs font-medium text-gray-400">
                    Log in to like this blog
                  </span>
                )}
              </div>

              <div className="mt-10 space-y-8 text-lg leading-9 text-[#2F3E3E]/82">
                {blog.content.map((block, index) => {
                if (typeof block === "string") {
                  return (
                    <p key={`${blog.slug}-paragraph-${index}`}>
                      <InlineRichText text={block} />
                    </p>
                  );
                }

                if (block.type === "heading") {
                  return (
                    <PublicHeadingBlock
                      key={`${blog.slug}-heading-${index}`}
                      block={block}
                    />
                  );
                }

                if (block.type === "youtube") {
                  return (
                    <PublicYouTubeBlock
                        key={`${blog.slug}-youtube-${index}`}
                        block={block}
                        isPlaying={activeVideoIndex === index}
                        onPlay={() => setActiveVideoIndex(index)}
                      />
                    );
                  }

                if (block.type === "table") {
                  return (
                    <PublicTableBlock
                        key={`${blog.slug}-table-${index}`}
                        block={block}
                      />
                    );
                  }

                  return (
                    <PublicPdfBlock
                      key={`${blog.slug}-pdf-${index}`}
                      block={block}
                    />
                  );
                })}
              </div>

              <section className="mt-12 rounded-[1.9rem] border border-[#DCE8E8] bg-white p-5 shadow-lg sm:p-6">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#2CA4A4]" />
                  <h2 className="text-2xl font-black text-[#2F3E3E]">
                    Comments ({blog.comments?.length ?? 0})
                  </h2>
                </div>

                <div className="mt-4 space-y-4">
                  {(blog.comments ?? []).length ? (
                    (blog.comments ?? []).map((comment) => {
                      const canDelete =
                        user?.email?.trim().toLowerCase() ===
                        comment.authorEmail.trim().toLowerCase();

                      return (
                        <article
                          key={comment.id}
                          className="rounded-2xl border border-[#E3EAEA] bg-[#FDFEFE] p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#2F3E3E]">
                                {comment.authorName}
                              </p>
                              <p className="text-xs text-[#6A7673]">
                                {comment.authorEmail} |{" "}
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {canDelete ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-[#EACFCF] px-3 py-1 text-xs font-semibold text-[#9A3D3D] transition hover:bg-[#FFF3F3]"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            ) : null}
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#2F3E3E]/86">
                            {comment.body}
                          </p>
                        </article>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[#6A7673]">
                      No comments yet. Be the first to comment.
                    </p>
                  )}
                </div>

                {user?.email ? (
                  <div className="mt-5 space-y-3">
                    <textarea
                      value={commentBody}
                      onChange={(event) => setCommentBody(event.target.value)}
                      placeholder="Add a comment..."
                      rows={4}
                      className="w-full rounded-2xl border border-[#D9E3E3] bg-white px-4 py-3 text-sm text-[#2F3E3E] outline-none transition focus:border-[#2CA4A4]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handlePostComment}
                        disabled={!commentBody.trim()}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2F3E3E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        <Send size={14} />
                        Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="mt-5 inline-flex rounded-full border border-[#2CA4A4]/30 px-4 py-2 text-sm font-semibold text-[#2CA4A4] transition hover:bg-[#2CA4A4]/10"
                  >
                    Login to comment
                  </Link>
                )}
              </section>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
