import { ImagePlus, MessageSquare, PlusCircle, Video } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  createId,
  formatDate,
  getStoredTopics,
  getStoredTopicsAsync,
  getTopicCoverImage,
  readFileAsDataUrl,
  saveStoredTopics,
  saveStoredTopicsAsync,
  type DiscussionMedia,
  type DiscussionTopic,
} from "./discussionData";

export default function DiscussionPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<DiscussionTopic[]>(() => getStoredTopics());
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicBody, setTopicBody] = useState("");
  const [topicAttachments, setTopicAttachments] = useState<DiscussionMedia[]>(
    [],
  );

  useEffect(() => {
    saveStoredTopics(topics);
    void saveStoredTopicsAsync(topics);
  }, [topics]);

  useEffect(() => {
    void getStoredTopicsAsync().then(setTopics);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

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

    setTopicAttachments((current) => [...current, ...uploadedMedia]);
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setTopicAttachments((current) => current.filter((item) => item.id !== id));
  }

  function resetTopicComposer() {
    setIsCreatingTopic(false);
    setTopicTitle("");
    setTopicBody("");
    setTopicAttachments([]);
  }

  function handleCreateTopic() {
    if (!user || !topicTitle.trim() || !topicBody.trim()) {
      return;
    }

    const newTopic: DiscussionTopic = {
      id: createId(),
      title: topicTitle.trim(),
      body: topicBody.trim(),
      authorName: user.name,
      authorEmail: user.email,
      createdAt: new Date().toISOString(),
      attachments: topicAttachments,
      comments: [],
    };

    const updatedTopics = [newTopic, ...topics];
    saveStoredTopics(updatedTopics);
    void saveStoredTopicsAsync(updatedTopics);
    setTopics(updatedTopics);
    resetTopicComposer();
    navigate(`/dashboard/discussion/${newTopic.id}`);
  }

  return (
    <div
      className={`mx-auto max-w-7xl px-4 py-8 transition-all duration-300 ease-out sm:px-6 lg:px-8 ${
        isReady ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <style>{`
        @keyframes discussionFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.03);
          }
        }
      `}</style>
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#123629]/10 bg-[linear-gradient(135deg,#F7FBF5_0%,#FFFFFF_46%,#E4F0DE_100%)] p-8 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(18,54,41,0.03)_0%,rgba(18,54,41,0)_32%,rgba(94,193,232,0.08)_68%,rgba(165,200,90,0.12)_100%)]" />
        <div className="pointer-events-none absolute -left-12 -top-14 h-56 w-56 animate-[discussionFloat_15s_ease-in-out_infinite] rounded-full bg-[#5EC1E8]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[-3rem] top-10 h-64 w-64 animate-[discussionFloat_18s_ease-in-out_infinite_reverse] rounded-full bg-[#A5C85A]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] left-[34%] h-56 w-56 animate-[discussionFloat_17s_ease-in-out_infinite] rounded-full bg-[#FFC94B]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] top-[20%] h-20 w-20 rotate-12 rounded-[1.75rem] border border-[#123629]/8 bg-white/35 backdrop-blur-sm" />
        <div className="pointer-events-none absolute left-[14%] bottom-[18%] h-16 w-16 -rotate-12 rounded-[1.5rem] border border-[#123629]/8 bg-white/35 backdrop-blur-sm" />
        <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full bg-[#123629]/8 px-3 py-1 text-sm font-medium text-[#123629]">
          <MessageSquare size={16} />
          Discussion
        </div>
        <h1 className="relative z-10 text-3xl font-bold text-[#1D2A2A]">
          Open topic discussions for thoughtful debate.
        </h1>
        <p className="relative z-10 mt-2 max-w-3xl text-sm text-[#5D6B68] sm:text-base">
          Browse discussions first. Open one to read the full discussion in its
          own page.
        </p>
      </div>

      <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1D2A2A]">
              Discussions
            </h2>
            <p className="text-sm text-[#6A7673]">
              Choose a topic card to open the discussion.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#EEF5EA] px-3 py-1 text-sm font-medium text-[#355E3B]">
              {topics.length} topic{topics.length === 1 ? "" : "s"}
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingTopic((current) => !current)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#355E3B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
            >
              <PlusCircle size={16} />
              New Topic
            </button>
          </div>
        </div>

        {isCreatingTopic ? (
          <div className="mt-5 rounded-[1.5rem] border border-[#D5E3CB] bg-[#F7F9F6] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1D2A2A]">
                  Create Topic
                </h3>
                <p className="text-sm text-[#6A7673]">
                  Keep it clear so others can jump in quickly.
                </p>
              </div>
              <button
                type="button"
                onClick={resetTopicComposer}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[#6A7673] hover:bg-white"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={topicTitle}
                onChange={(event) => setTopicTitle(event.target.value)}
                placeholder="Topic title"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
              />
              <textarea
                value={topicBody}
                onChange={(event) => setTopicBody(event.target.value)}
                placeholder="Describe the question or idea..."
                rows={5}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
              />

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
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
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-[#355E3B] hover:border-[#355E3B]">
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

              {topicAttachments.length ? (
                <div className="rounded-2xl bg-white p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6A7673]">
                    Attached media
                  </p>
                  <div className="space-y-2">
                    {topicAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-2xl border border-[#E7ECE7] px-3 py-2 text-sm text-[#1D2A2A]"
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
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateTopic}
                  className="rounded-2xl bg-[#355E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
                >
                  Create Topic
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {topics.length ? (
          <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex gap-4">
              {topics.map((topic) => (
                <article
                  key={topic.id}
                  className="w-[320px] shrink-0 rounded-[1.75rem] border border-[#E7ECE7] bg-[#FCFDFC] p-5 text-left transition hover:border-[#CAD9C1] hover:bg-white"
                >
                  <div className="mb-4 overflow-hidden rounded-[1.25rem] border border-[#E7ECE7] bg-[#EEF5EA]">
                    <img
                      src={getTopicCoverImage(topic)}
                      alt={topic.title}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#355E3B]">
                      {topic.comments.length} repl
                      {topic.comments.length === 1 ? "y" : "ies"}
                    </div>
                    {topic.attachments.length ? (
                      <div className="text-xs font-medium text-[#6A7673]">
                        {topic.attachments.length} media
                      </div>
                    ) : null}
                  </div>
                  <h3 className="line-clamp-2 break-words text-lg font-semibold text-[#1D2A2A]">
                    {topic.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-[#62706D]">
                    {topic.body}
                  </p>
                  <div className="mt-5 border-t border-[#E7ECE7] pt-4 text-xs text-[#7A8682]">
                    <div>{topic.authorName}</div>
                    <div className="mt-1">{formatDate(topic.createdAt)}</div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/discussion/${topic.id}`)}
                      className="rounded-2xl bg-[#355E3B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
                    >
                      View
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[1.75rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9] px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-[#1D2A2A]">
              No discussions yet
            </h3>
            <p className="mt-2 text-sm text-[#6A7673]">
              Create the first topic to open the conversation.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
