import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Lock, Send, Video } from "lucide-react";
import ScrollToTop from "@/components/common/ScrolltoTop";
import { useAuthContext } from "@/context/AuthContext";
import {
  createId,
  formatDate,
  getDiscussionCategory,
  getPublicTopics,
  getPublicTopicsAsync,
  getTopicCoverImage,
  readFileAsDataUrl,
  saveStoredTopics,
  saveStoredTopicsAsync,
  type DiscussionComment,
  type DiscussionMedia,
  type DiscussionTopic,
} from "./dashboard/discussionData";

function renderMedia(media: DiscussionMedia) {
  if (media.type === "image") {
    return (
      <img
        key={media.id}
        src={media.url}
        alt={media.name}
        className="h-56 w-full rounded-[1.5rem] border border-[#E7ECE7] object-cover"
      />
    );
  }

  return (
    <video
      key={media.id}
      controls
      className="h-64 w-full rounded-[1.5rem] border border-[#E7ECE7] bg-black"
    >
      <source src={media.url} />
      Your browser does not support this video.
    </video>
  );
}

export default function PublicDiscussionReadPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const { isAuthenticated, user } = useAuthContext();
  const [topics, setTopics] = useState<DiscussionTopic[]>(() => getPublicTopics());
  const [commentBody, setCommentBody] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<DiscussionMedia[]>([]);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === topicId) ?? null,
    [topicId, topics],
  );

  useEffect(() => {
    void getPublicTopicsAsync().then(setTopics);
  }, []);
  const commentsById = useMemo(() => {
    const comments = selectedTopic?.comments ?? [];
    return new Map(comments.map((comment) => [comment.id, comment]));
  }, [selectedTopic?.comments]);

  if (!selectedTopic) {
    return <Navigate to="/programs" replace />;
  }

  async function handleAttachmentUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const uploadedMedia = await Promise.all(
      files.map(async (file) => ({
        id: createId(),
        type: file.type.startsWith("video/") ? "video" : "image",
        url: await readFileAsDataUrl(file),
        name: file.name,
      })),
    );

    setCommentAttachments((current) => [...current, ...uploadedMedia]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setCommentAttachments((current) => current.filter((item) => item.id !== id));
  }

  function handlePostComment() {
    if (!user || !selectedTopic || !commentBody.trim()) {
      return;
    }

    const newComment: DiscussionComment = {
      id: createId(),
      authorName: user.name,
      authorEmail: user.email,
      body: commentBody.trim(),
      createdAt: new Date().toISOString(),
      attachments: commentAttachments,
      replyToCommentId: replyToCommentId ?? undefined,
    };

    const updatedTopics = topics.map((topic) =>
      topic.id === selectedTopic.id
        ? { ...topic, comments: [...topic.comments, newComment] }
        : topic,
    );

    setTopics(updatedTopics);
    saveStoredTopics(updatedTopics);
    void saveStoredTopicsAsync(updatedTopics);
    setCommentBody("");
    setCommentAttachments([]);
    setReplyToCommentId(null);
  }

  function handleSelectReply(commentId: string) {
    setReplyToCommentId(commentId);
    window.requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function handleDeleteComment(commentId: string) {
    if (!user || !selectedTopic) {
      return;
    }

    const updatedTopics = topics.map((topic) =>
      topic.id === selectedTopic.id
        ? {
            ...topic,
            comments: topic.comments.filter((comment) => comment.id !== commentId),
          }
        : topic,
    );

    setTopics(updatedTopics);
    saveStoredTopics(updatedTopics);
    void saveStoredTopicsAsync(updatedTopics);
    if (replyToCommentId === commentId) {
      setReplyToCommentId(null);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF7F2] text-[#2F3E3E]">
      <ScrollToTop />
      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="discussionReadBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.28 }} />
                <stop offset="52%" style={{ stopColor: "#5EC1E8", stopOpacity: 0.16 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0.26 }} />
              </linearGradient>
              <radialGradient id="discussionReadOrbA" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#2CA4A4", stopOpacity: 0.25 }} />
                <stop offset="100%" style={{ stopColor: "#2CA4A4", stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="discussionReadOrbB" cx="50%" cy="50%">
                <stop offset="0%" style={{ stopColor: "#FFC94B", stopOpacity: 0.32 }} />
                <stop offset="100%" style={{ stopColor: "#FFC94B", stopOpacity: 0 }} />
              </radialGradient>
            </defs>
            <rect width="1200" height="900" fill="url(#discussionReadBg)" opacity="0.72" />
            <circle cx="180" cy="160" r="140" fill="url(#discussionReadOrbA)">
              <animate attributeName="r" values="125;185;125" dur="8s" repeatCount="indefinite" />
            </circle>
            <circle cx="1010" cy="700" r="145" fill="url(#discussionReadOrbB)">
              <animate attributeName="r" values="135;200;135" dur="9s" repeatCount="indefinite" />
            </circle>
            <path
              d="M-80,390 Q220,300 520,390 T1120,390 T1420,390"
              fill="none"
              stroke="#2CA4A4"
              strokeDasharray="12,12"
              strokeWidth="4"
              opacity="0.26"
            >
              <animate
                attributeName="d"
                values="M-80,390 Q220,300 520,390 T1120,390 T1420,390;M-80,390 Q220,500 520,390 T1120,390 T1420,390;M-80,390 Q220,300 520,390 T1120,390 T1420,390"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.4s" repeatCount="indefinite" />
            </path>
            {[...Array(14)].map((_, i) => {
              const x = (i * 101 + 86) % 1100;
              const y = (i * 71 + 120) % 720;
              const color = ["#2CA4A4", "#FFC94B", "#5EC1E8", "#A5C85A"][i % 4];

              return (
                <g key={`discussion-read-bubble-${i}`} opacity="0.4">
                  <rect x={x} y={y} width={44} height={28} rx={14} fill={color}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0; 0 -20; 0 0"
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
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/programs"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2CA4A4]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2F3E3E] shadow-sm backdrop-blur transition hover:border-[#2CA4A4]/50 hover:text-[#2CA4A4]"
          >
            <ArrowLeft size={16} />
            Back to Discussions
          </Link>

          <article className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/88 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-0 lg:grid-cols-[0.9fr,1.1fr]">
              <div className="relative min-h-[340px] overflow-hidden bg-[#F7FAFA] lg:min-h-full">
                <img
                  src={getTopicCoverImage(selectedTopic)}
                  alt={selectedTopic.title}
                  className="h-full min-h-[340px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F3E3E]/60 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-[#FFC94B] px-4 py-2 text-sm font-black text-[#172222] shadow-lg">
                  {getDiscussionCategory(selectedTopic)}
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/65 bg-white/82 p-5 shadow-lg backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2CA4A4]">
                    Thread stats
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[#2F3E3E]/72">
                    <span>{selectedTopic.comments.length} comments</span>
                    <span className="h-1 w-1 self-center rounded-full bg-[#2F3E3E]/35" />
                    <span>{selectedTopic.attachments.length} media items</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#2F3E3E]/58">
                  <span className="font-semibold text-[#2CA4A4]">
                  {selectedTopic.authorName}
                </span>
                <span>{selectedTopic.authorEmail}</span>
                <span>&bull;</span>
                <span>{formatDate(selectedTopic.createdAt)}</span>
              </div>

                <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-[#2F3E3E] sm:text-5xl">
                {selectedTopic.title}
              </h1>
                <p className="mt-6 whitespace-pre-wrap text-lg leading-9 text-[#2F3E3E]/74">
                {selectedTopic.body}
              </p>

                <div className="mt-12 border-t border-[#E7ECE7] pt-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                      <h2 className="text-2xl font-black text-[#2F3E3E]">
                      Replies
                    </h2>
                      <p className="mt-1 text-sm text-[#2F3E3E]/58">
                      Read the public conversation below.
                    </p>
                  </div>
                    <span className="rounded-full bg-[#2CA4A4]/10 px-4 py-2 text-sm font-semibold text-[#1E7C7C]">
                    {selectedTopic.comments.length} comments
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedTopic.comments.length ? (
                    selectedTopic.comments.map((comment) => (
                      <article
                        key={comment.id}
                          className={`flex max-w-full items-start gap-3 rounded-[1.5rem] border border-[#E7ECE7] bg-white/82 p-4 shadow-sm sm:p-5 ${
                            comment.replyToCommentId ? "ml-3 border-l-4 border-l-[#2CA4A4]/40 sm:ml-8" : ""
                          }`}
                      >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC94B] text-sm font-black text-[#172222]">
                          {comment.authorName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[#6A7673]">
                              <span className="break-words font-semibold text-[#1D2A2A]">
                              {comment.authorName}
                            </span>
                            <span className="min-w-0 break-all">{comment.authorEmail}</span>
                            <span>&bull;</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                            <div className="mt-2 min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-[#32403E]">
                            {comment.replyToCommentId &&
                            commentsById.has(comment.replyToCommentId) ? (
                              <span className="mb-3 block max-w-full overflow-hidden rounded-xl border-l-4 border-[#2CA4A4] bg-[#EAF8F7] px-3 py-2">
                                <span className="block text-xs font-bold text-[#1E7C7C]">
                                  {commentsById.get(comment.replyToCommentId)?.authorName}
                                </span>
                                <span className="mt-1 line-clamp-2 break-words text-xs font-medium leading-5 text-[#2F3E3E]/62">
                                  {commentsById.get(comment.replyToCommentId)?.body}
                                </span>
                              </span>
                            ) : null}
                            {comment.body}
                          </div>
                          {comment.attachments.length ? (
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {comment.attachments.map((media) => renderMedia(media))}
                            </div>
                          ) : null}
                          {isAuthenticated ? (
                            <div className="mt-4 flex items-center justify-between gap-2">
                              {user?.email.trim().toLowerCase() ===
                              comment.authorEmail.trim().toLowerCase() ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="rounded-full bg-[#9A3D3D] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#7F3030]"
                                >
                                  Delete
                                </button>
                              ) : (
                                <span />
                              )}
                              <button
                                type="button"
                                onClick={() => handleSelectReply(comment.id)}
                                aria-label={`Reply to ${comment.authorName}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2CA4A4]/35 bg-[#EAF8F7] text-[#1E7C7C] shadow-sm transition hover:bg-[#D7F1EF]"
                              >
                                <span className="text-lg font-black leading-none">⮌</span>
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))
                  ) : (
                      <div className="rounded-[1.5rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9]/86 px-6 py-10 text-center">
                        <h3 className="text-base font-semibold text-[#1D2A2A]">
                        No replies yet
                      </h3>
                        <p className="mt-2 text-sm text-[#6A7673]">
                        Sign in to add the first perspective.
                      </p>
                    </div>
                  )}
                </div>

                  <div className="mt-8 border-t border-[#E7ECE7] pt-6">
                  {isAuthenticated && user ? (
                    <div ref={composerRef} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC94B] text-sm font-black text-[#172222]">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        {replyToCommentId && commentsById.has(replyToCommentId) ? (
                          <div className="mb-3 rounded-xl border-l-4 border-[#2CA4A4] bg-[#EAF8F7] px-3 py-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1E7C7C]">
                                  {commentsById.get(replyToCommentId)?.authorName}
                                </p>
                                <p className="mt-1 line-clamp-2 break-words text-xs font-medium leading-5 text-[#2F3E3E]/62">
                                  {commentsById.get(replyToCommentId)?.body}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setReplyToCommentId(null)}
                                className="shrink-0 text-xs font-bold text-[#9A3D3D]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : null}
                        <textarea
                          value={commentBody}
                          onChange={(event) => setCommentBody(event.target.value)}
                          placeholder="Add a public reply..."
                          rows={3}
                            className="w-full rounded-2xl border border-gray-200 bg-white/86 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition placeholder:text-[#6A7673]/45 focus:border-[#2CA4A4]"
                        />

                        <div className="mt-3 flex flex-wrap gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/86 px-4 py-2.5 text-sm font-medium text-[#2CA4A4] hover:border-[#2CA4A4]">
                            <ImagePlus size={16} />
                            Images
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(event) => void handleAttachmentUpload(event)}
                            />
                          </label>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/86 px-4 py-2.5 text-sm font-medium text-[#2CA4A4] hover:border-[#2CA4A4]">
                            <Video size={16} />
                            Videos
                            <input
                              type="file"
                              accept="video/*"
                              multiple
                              className="hidden"
                              onChange={(event) => void handleAttachmentUpload(event)}
                            />
                          </label>
                        </div>

                        {commentAttachments.length ? (
                          <div className="mt-4 space-y-2">
                            {commentAttachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                  className="flex items-center justify-between rounded-2xl border border-[#E7ECE7] bg-white/86 px-3 py-2 text-sm text-[#1D2A2A]"
                              >
                                <span className="truncate">{attachment.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(attachment.id)}
                                    className="text-xs font-medium text-[#9A3D3D]"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handlePostComment}
                              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC94B] px-5 py-3 text-sm font-black text-[#172222] transition hover:bg-[#A5C85A]"
                          >
                            <Send size={16} />
                            Post Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#2CA4A4]/20 bg-[#EAF8F7]/90 p-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFC94B] text-[#172222] shadow-sm">
                          <Lock size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#2F3E3E]">
                            Login to comment
                          </h3>
                            <p className="mt-1 text-sm leading-6 text-[#2F3E3E]/65">
                            You can read this discussion publicly. Sign in to add
                            your reply with text, images, or videos.
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/programs/${selectedTopic.id}` } }}
                          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#FFC94B] px-5 py-3 text-sm font-bold text-[#172222] shadow-md transition hover:bg-[#A5C85A]"
                      >
                        Login to comment
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
