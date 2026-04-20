import { MessageSquareText, Send } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  addFeedbackEntry,
  addFeedbackEntryAsync,
  deleteFeedbackEntry,
  deleteFeedbackEntryAsync,
  getFeedbackEntries,
  getFeedbackEntriesAsync,
  type FeedbackEntry,
} from "./feedbackData";
import { createId, formatDate } from "./discussionData";

const FEEDBACK_ADMIN_EMAILS = new Set([
  "sandipan.roy@indusschool.com",
  "sandipanroy@indusschool.com",
]);
const FEEDBACK_INBOX_EMAIL = "sandipan.roy@indusschool.com";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export default function FeedbackPage() {
  const { user } = useAuthContext();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [entries, setEntries] = useState<FeedbackEntry[]>(() =>
    getFeedbackEntries(),
  );

  const normalizedUserEmail = normalizeEmail(user?.email);
  const isFeedbackAdmin = FEEDBACK_ADMIN_EMAILS.has(normalizedUserEmail);

  useEffect(() => {
    void getFeedbackEntriesAsync().then(setEntries);
  }, []);

  const visibleEntries = useMemo(() => {
    if (isFeedbackAdmin) {
      return entries;
    }

    return entries.filter(
      (entry) => normalizeEmail(entry.authorEmail) === normalizedUserEmail,
    );
  }, [entries, isFeedbackAdmin, normalizedUserEmail]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;

    const newEntry: FeedbackEntry = {
      id: createId(),
      authorName: user.name,
      authorEmail: user.email,
      recipientEmail: FEEDBACK_INBOX_EMAIL,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedEntries = addFeedbackEntry(newEntry);
    setEntries(updatedEntries);
    setSubject("");
    setMessage("");
    setSaveMessage("Feedback submitted.");

    void addFeedbackEntryAsync(newEntry).then(setEntries);
  }

  function handleDelete(entryId: string) {
    const updatedEntries = deleteFeedbackEntry(entryId);
    setEntries(updatedEntries);
    void deleteFeedbackEntryAsync(entryId).then(setEntries);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-[#123629]/10 bg-[linear-gradient(135deg,#F7FBF5_0%,#FFFFFF_46%,#E4F0DE_100%)] p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#123629]/8 px-3 py-1 text-sm font-medium text-[#123629]">
          <MessageSquareText size={16} />
          Platform Feedback
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#1D2A2A]">
          {isFeedbackAdmin ? "Platform Feedback Inbox" : "Share Platform Feedback"}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5D6B68] sm:text-base">
          {isFeedbackAdmin
            ? "Review all platform feedback submitted across the dashboard."
            : "Send technical or platform feedback directly to Sandipan for review."}
        </p>
      </div>

      {!isFeedbackAdmin && (
        <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1D2A2A]">
            New Platform Feedback
          </h2>
          <p className="mt-1 text-sm text-[#6A7673]">
            Keep it specific so it can be acted on quickly.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your feedback here..."
              rows={6}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#355E3B]"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#6A7673]">{saveMessage}</p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#355E3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2B4C30]"
              >
                <Send size={16} />
                Submit Feedback
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-6 rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#1D2A2A]">
              {isFeedbackAdmin ? "All Feedback" : "Your Feedback"}
            </h2>
            <p className="text-sm text-[#6A7673]">
              {visibleEntries.length} entr{visibleEntries.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </div>

        {visibleEntries.length ? (
          <div className="space-y-4">
            {visibleEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-[1.5rem] border border-[#E7ECE7] bg-[#FCFDFC] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D2A2A]">
                      {entry.subject}
                    </h3>
                    <p className="mt-1 text-sm text-[#6A7673]">
                      {entry.authorName} · {entry.authorEmail}
                    </p>
                  </div>
                  <p className="text-xs font-medium text-[#7A8682]">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#32403E]">
                  {entry.message}
                </p>
                {(isFeedbackAdmin ||
                  normalizeEmail(entry.authorEmail) === normalizedUserEmail) && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="rounded-2xl bg-[#9A3D3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7F3030]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9] px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-[#1D2A2A]">
              No feedback yet
            </h3>
            <p className="mt-2 text-sm text-[#6A7673]">
              {isFeedbackAdmin
                ? "Submitted feedback will appear here."
                : "You have not submitted any feedback yet."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
