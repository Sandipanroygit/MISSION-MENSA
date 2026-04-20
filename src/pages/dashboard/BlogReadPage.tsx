import {
  ArrowLeft,
  Eye,
  FileText,
  MessageCircle,
  PlayCircle,
  Send,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import InlineRichText from "@/components/common/InlineRichText";
import {
  deletePublishedBlog,
  deletePublishedBlogAsync,
  getPublishedBlogs,
  getPublishedBlogsAsync,
  getBlogStats,
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

function PdfEmbed({ block }: { block: BlogPdfBlock }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#E3EAEA] bg-[#F7FAFA] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3EAEA] bg-white p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2CA4A4]">
            PDF Report
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#2F3E3E]">
            {block.title}
          </h3>
        </div>
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#2F3E3E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2CA4A4]"
        >
          <FileText size={18} />
          Open PDF
        </a>
      </div>
      <iframe
        src={block.url}
        title={block.title}
        className="h-[70vh] min-h-[620px] w-full bg-white"
      />
    </div>
  );
}

function HeadingEmbed({ block }: { block: BlogHeadingBlock }) {
  const styles =
    block.level === 1
      ? "text-3xl sm:text-4xl font-serif font-black text-[#2F3E3E] leading-tight"
      : block.level === 2
      ? "text-2xl sm:text-3xl font-serif font-bold text-[#2F3E3E]/92"
      : "text-xl font-semibold text-[#2F3E3E]/88";

  return <p className={`mt-10 ${styles}`}>{block.text}</p>;
}

function TableEmbed({ block }: { block: BlogTableBlock }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[#E3EAEA] bg-white shadow-sm">
      <div className="border-b border-[#E3EAEA] bg-[#F7FAFA] px-5 py-4">
        <h3 className="text-lg font-bold text-[#2F3E3E]">{block.title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm leading-6 text-[#2F3E3E]">
          <thead>
            <tr className="bg-[#2F3E3E] text-white">
              {block.headers.map((header) => (
                <th
                  key={header || "comparison-point"}
                  scope="col"
                  className="border-r border-white/15 px-5 py-4 text-sm font-semibold last:border-r-0"
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
                    className={`border-r border-t border-[#E3EAEA] px-5 py-4 align-top last:border-r-0 ${
                      cellIndex === 0
                        ? "font-bold text-[#2CA4A4]"
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

export default function BlogReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();
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
    return <Navigate to="/dashboard/writing-blogs" replace />;
  }

  const canEdit =
    user?.email?.trim().toLowerCase() === blog.authorEmail.trim().toLowerCase();
  const stats = getBlogStats(blog);
  const isLikedByUser = Boolean(
    user?.email &&
      blog.likedBy?.includes(user.email.trim().toLowerCase()),
  );

  function handleDeleteBlog() {
    deletePublishedBlog(blog.slug);
    void deletePublishedBlogAsync(blog.slug).finally(() => {
      navigate("/dashboard/writing-blogs");
    });
  }

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
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#62706D]/80">
            <span className="inline-flex items-center gap-2">
              <Eye size={16} className="text-[#62706D]/60" />
              {stats.views} views
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle size={16} className="text-[#62706D]/60" />
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

          <div className="mt-8 space-y-8 text-base leading-8 text-[#2F3E3E]/85">
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
                  <HeadingEmbed
                    key={`${blog.slug}-heading-${index}`}
                    block={block}
                  />
                );
              }

              if (block.type === "youtube") {
                return (
                  <YouTubeEmbed
                    key={`${blog.slug}-youtube-${index}`}
                    block={block}
                    isPlaying={activeVideoIndex === index}
                    onPlay={() => setActiveVideoIndex(index)}
                  />
                );
              }

              if (block.type === "table") {
                return (
                  <TableEmbed key={`${blog.slug}-table-${index}`} block={block} />
                );
              }

              return (
                <PdfEmbed key={`${blog.slug}-pdf-${index}`} block={block} />
              );
            })}
          </div>

          <section className="mt-12 rounded-[1.75rem] border border-[#E3EAEA] bg-[#F7FAFA] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-[#2CA4A4]" />
              <h2 className="text-xl font-bold text-[#2F3E3E]">
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
                      className="rounded-2xl border border-[#E3EAEA] bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#2F3E3E]">
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
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#2F3E3E]/88">
                        {comment.body}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p className="text-sm text-[#6A7673]">
                  No comments yet. Start the conversation.
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
                  state={{ editSlug: blog.slug }}
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
