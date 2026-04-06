import { ImagePlus, Send, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  createId,
  formatDate,
  getStoredTopics,
  getTopicCoverImage,
  readFileAsDataUrl,
  saveStoredTopics,
  type DiscussionMedia,
  type DiscussionComment,
  type DiscussionTopic,
} from "./discussionData";

function renderMedia(media: DiscussionMedia) {
  if (media.type === "image") {
    return (
      <img
        key={media.id}
        src={media.url}
        alt={media.name}
        className="h-48 w-full rounded-2xl border border-[#E7ECE7] object-cover"
      />
    );
  }

  return (
    <video
      key={media.id}
      controls
      className="h-56 w-full rounded-2xl border border-[#E7ECE7] bg-black"
    >
      <source src={media.url} />
      Your browser does not support this video.
    </video>
  );
}

export default function DiscussionTopicPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [topics, setTopics] = useState<DiscussionTopic[]>(() => getStoredTopics());
  const [isReady, setIsReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editAttachments, setEditAttachments] = useState<DiscussionMedia[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<
    DiscussionMedia[]
  >([]);
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveStoredTopics(topics);
  }, [topics]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === topicId) ?? null,
    [topicId, topics],
  );
  const commentsById = useMemo(() => {
    const comments = selectedTopic?.comments ?? [];
    return new Map(comments.map((comment) => [comment.id, comment]));
  }, [selectedTopic?.comments]);
  const isOwner = Boolean(
    user &&
      selectedTopic &&
      user.email.trim().toLowerCase() ===
        selectedTopic.authorEmail.trim().toLowerCase(),
  );

  useEffect(() => {
    if (!selectedTopic || isEditing) {
      return;
    }

    setEditTitle(selectedTopic.title);
    setEditBody(selectedTopic.body);
    setEditAttachments(selectedTopic.attachments);
  }, [isEditing, selectedTopic]);

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

  async function handleEditAttachmentUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
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

    setEditAttachments((current) => [...current, ...uploadedMedia]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setCommentAttachments((current) => current.filter((item) => item.id !== id));
  }

  function removeEditAttachment(id: string) {
    setEditAttachments((current) => current.filter((item) => item.id !== id));
  }

  function handleDeleteTopic() {
    if (!selectedTopic || !isOwner) {
      return;
    }

    const updatedTopics = topics.filter((topic) => topic.id !== selectedTopic.id);
    setTopics(updatedTopics);
    saveStoredTopics(updatedTopics);
    navigate("/dashboard/discussion");
  }

  function handleSaveTopic() {
    if (!selectedTopic || !isOwner || !editTitle.trim() || !editBody.trim()) {
      return;
    }

    const updatedTopics = topics.map((topic) =>
      topic.id === selectedTopic.id
        ? {
            ...topic,
            title: editTitle.trim(),
            body: editBody.trim(),
            attachments: editAttachments,
          }
        : topic,
    );

    setTopics(updatedTopics);
    saveStoredTopics(updatedTopics);
    setIsEditing(false);
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

    setTopics((current) =>
      current.map((topic) =>
        topic.id === selectedTopic.id
          ? { ...topic, comments: [...topic.comments, newComment] }
          : topic,
      ),
    );
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

    setTopics((current) =>
      current.map((topic) =>
        topic.id === selectedTopic.id
          ? {
              ...topic,
              comments: topic.comments.filter(
                (comment) => comment.id !== commentId,
              ),
            }
          : topic,
      ),
    );

    if (replyToCommentId === commentId) {
      setReplyToCommentId(null);
    }
  }

  if (!selectedTopic) {
    return (
      <div
        className={`mx-auto max-w-5xl px-4 py-8 transition-all duration-300 ease-out sm:px-6 lg:px-8 ${
          isReady ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-[2rem] border border-[#E7ECE7] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#1D2A2A]">
            Discussion not found
          </h1>
          <p className="mt-2 text-sm text-[#6A7673]">
            This topic no longer exists or has not been created yet.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/discussion")}
            className="mt-5 rounded-2xl bg-[#355E3B] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto max-w-5xl px-4 py-8 transition-all duration-300 ease-out sm:px-6 lg:px-8 ${
        isReady ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
        <div className="border-b border-[#E7ECE7] pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start gap-4">
              <div>
                <p className="text-sm font-medium text-[#6A7673]">
                  Open Discussion
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#1D2A2A]">
                  {selectedTopic.title}
                </h1>
              </div>
              <div className="pt-0.5 text-sm text-[#6A7673]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-[#4D5A57]">Started by</span>
                  <span className="font-semibold text-[#1D2A2A]">
                    {selectedTopic.authorName}
                  </span>
                  <span>&bull;</span>
                  <span>{selectedTopic.authorEmail}</span>
                  <span>&bull;</span>
                  <span>{formatDate(selectedTopic.createdAt)}</span>
                </div>
              </div>
            </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 lg:max-w-[360px]">
              {isOwner ? (
                <>
                  <span className="rounded-full bg-[#EEF5EA] px-3 py-1 text-xs font-semibold text-[#355E3B]">
                    Your topic
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTitle(selectedTopic.title);
                      setEditBody(selectedTopic.body);
                      setEditAttachments(selectedTopic.attachments);
                      setIsEditing(true);
                    }}
                    className="rounded-2xl bg-[#355E3B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
                  >
                    Edit Topic
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteTopic}
                    className="rounded-2xl bg-[#9A3D3D] px-4 py-2 text-sm font-medium text-white"
                  >
                    Delete
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => navigate("/dashboard/discussion")}
                className="rounded-2xl border border-[#D6DEDA] px-4 py-2 text-sm font-medium text-[#4D5A57]"
              >
                Back to Topics
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-5 space-y-4">
              <input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-base font-semibold text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
              />
              <textarea
                value={editBody}
                onChange={(event) => setEditBody(event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
              />
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
                  <ImagePlus size={16} />
                  Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleEditAttachmentUpload(event)}
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
                  <Video size={16} />
                  Videos
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleEditAttachmentUpload(event)}
                  />
                </label>
              </div>
              {editAttachments.length ? (
                <div className="space-y-2">
                  {editAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-2xl border border-[#E7ECE7] bg-white px-3 py-2 text-sm text-[#1D2A2A]"
                    >
                      <span className="truncate">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => removeEditAttachment(attachment.id)}
                        className="text-xs font-medium text-[#9A3D3D]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-2xl border border-[#D6DEDA] px-4 py-2 text-sm font-medium text-[#4D5A57]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTopic}
                  className="rounded-2xl bg-[#355E3B] px-4 py-2 text-sm font-medium text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#32403E]">
                {selectedTopic.body}
              </p>
              {selectedTopic.attachments.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {selectedTopic.attachments.map((media) => renderMedia(media))}
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#E7ECE7] bg-[#EEF5EA]">
                  <img
                    src={getTopicCoverImage(selectedTopic)}
                    alt={selectedTopic.title}
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1D2A2A]">Replies</h2>
            <p className="text-sm text-[#6A7673]">
              Read the conversation below.
            </p>
          </div>

          <div className="space-y-4">
            {selectedTopic.comments.length ? (
              selectedTopic.comments.map((comment) => (
                <article
                  key={comment.id}
                  className={`flex max-w-full items-start gap-3 rounded-[1.5rem] border border-[#E7ECE7] bg-[#FCFDFC] p-4 sm:p-5 ${
                    comment.replyToCommentId
                      ? "ml-3 border-l-4 border-l-[#355E3B]/35 sm:ml-8"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF5EA] text-sm font-semibold text-[#355E3B]">
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
                        <span className="mb-3 block max-w-full overflow-hidden rounded-xl border-l-4 border-[#355E3B] bg-[#EEF5EA] px-3 py-2">
                          <span className="block text-xs font-bold text-[#355E3B]">
                            {commentsById.get(comment.replyToCommentId)?.authorName}
                          </span>
                          <span className="mt-1 line-clamp-2 break-words text-xs font-medium leading-5 text-[#4D5A57]/70">
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#355E3B]/35 bg-[#EEF5EA] text-[#355E3B] shadow-sm transition hover:bg-[#DDEED7]"
                      >
                        <span className="text-lg font-black leading-none">⮌</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9] px-6 py-10 text-center">
                <h3 className="text-base font-semibold text-[#1D2A2A]">
                  No replies yet
                </h3>
                <p className="mt-2 text-sm text-[#6A7673]">
                  Be the first person to add a perspective.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-[#E7ECE7] pt-6">
            <div ref={composerRef} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCECC8] text-sm font-semibold text-[#355E3B]">
                {(user?.name ?? "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                {replyToCommentId && commentsById.has(replyToCommentId) ? (
                  <div className="mb-3 rounded-xl border-l-4 border-[#355E3B] bg-[#EEF5EA] px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#355E3B]">
                          {commentsById.get(replyToCommentId)?.authorName}
                        </p>
                        <p className="mt-1 line-clamp-2 break-words text-xs font-medium leading-5 text-[#4D5A57]/70">
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
                  className="w-full rounded-2xl border border-gray-200 bg-[#FCFDFC] px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
                />

                <div className="mt-3 flex flex-wrap gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
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
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
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
                        className="flex items-center justify-between rounded-2xl border border-[#E7ECE7] bg-white px-3 py-2 text-sm text-[#1D2A2A]"
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
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#355E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
                  >
                    <Send size={16} />
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
