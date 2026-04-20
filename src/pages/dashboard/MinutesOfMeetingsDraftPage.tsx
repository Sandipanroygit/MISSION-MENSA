import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createId, formatDate } from "./discussionData";
import {
  deleteMeetingMinutesEntry,
  deleteMeetingMinutesEntryAsync,
  getMeetingMinutesEntries,
  getMeetingMinutesEntriesAsync,
  type MeetingMinutesEntry,
  upsertMeetingMinutesEntry,
  upsertMeetingMinutesEntryAsync,
} from "./meetingMinutesData";

const emptyForm = {
  title: "",
  meetingDate: new Date().toISOString().slice(0, 10),
  minutes: "",
};

export default function MinutesOfMeetingsDraftPage() {
  const { user, isAdmin, isParent } = useAuthContext();
  const [entries, setEntries] = useState<MeetingMinutesEntry[]>(() =>
    getMeetingMinutesEntries(),
  );
  const [title, setTitle] = useState(emptyForm.title);
  const [meetingDate, setMeetingDate] = useState(emptyForm.meetingDate);
  const [minutes, setMinutes] = useState(emptyForm.minutes);
  const [isPublished, setIsPublished] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const canManageAllEntries = isAdmin || isParent;

  useEffect(() => {
    void getMeetingMinutesEntriesAsync().then(setEntries);
  }, []);

  const visibleEntries = useMemo(() => {
    if (canManageAllEntries) {
      return entries;
    }

    return entries.filter(
      (entry) =>
        entry.authorEmail.trim().toLowerCase() ===
        user?.email?.trim().toLowerCase(),
    );
  }, [canManageAllEntries, entries, user?.email]);

  function resetForm() {
    setTitle(emptyForm.title);
    setMeetingDate(new Date().toISOString().slice(0, 10));
    setMinutes(emptyForm.minutes);
    setIsPublished(false);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !title.trim() || !meetingDate.trim() || !minutes.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const existingEntry = entries.find((item) => item.id === editingId);
    const entry: MeetingMinutesEntry = {
      id: editingId ?? createId(),
      title: title.trim(),
      meetingDate,
      minutes: minutes.trim(),
      authorName: user.name,
      authorEmail: user.email,
      createdAt: existingEntry?.createdAt ?? now,
      updatedAt: now,
      isPublished,
    };

    const updatedEntries = upsertMeetingMinutesEntry(entry);
    setEntries(updatedEntries);
    setSaveMessage(
      isPublished
        ? "Minutes saved and published."
        : "Minutes saved as draft.",
    );
    resetForm();

    void upsertMeetingMinutesEntryAsync(entry).then(setEntries);
  }

  function handleEdit(entry: MeetingMinutesEntry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setMeetingDate(entry.meetingDate);
    setMinutes(entry.minutes);
    setIsPublished(entry.isPublished);
    setSaveMessage(null);
  }

  function handleDelete(id: string) {
    const updatedEntries = deleteMeetingMinutesEntry(id);
    setEntries(updatedEntries);
    if (editingId === id) {
      resetForm();
    }
    void deleteMeetingMinutesEntryAsync(id).then(setEntries);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-[#123629]/10 bg-[linear-gradient(135deg,#F9FBFF_0%,#FFFFFF_46%,#E8F1F3_100%)] p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#17353F]/8 px-3 py-1 text-sm font-medium text-[#17353F]">
          <FileText size={16} />
          Daily Minutes of Meetings
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#1D2A2A]">
          Draft and publish MOM notes
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5D6B68] sm:text-base">
          Maintain internal meeting drafts and publish selected minutes for
          public viewing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2A2A]">
                {editingId ? "Edit meeting minutes" : "New meeting minutes"}
              </h2>
              <p className="mt-1 text-sm text-[#6A7673]">
                Capture agenda outcomes, decisions, and action items.
              </p>
            </div>
            <div className="rounded-full bg-[#17353F]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17353F]">
              MOM Draft
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Meeting title"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
            />

            <input
              type="date"
              value={meetingDate}
              onChange={(event) => setMeetingDate(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
            />

            <textarea
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
              placeholder="Agenda, decisions, owners, and due dates..."
              rows={9}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-7 text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-[#E7ECE7] bg-[#FAFBFC] px-4 py-3 text-sm text-[#32403E]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#17353F] focus:ring-[#17353F]"
              />
              Publish this MOM entry to the public page
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6A7673]">{saveMessage}</p>
              <div className="flex gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-[#DCE3E2] px-5 py-3 text-sm font-semibold text-[#425251] transition hover:bg-[#F6F8F8]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#17353F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A32]"
                >
                  {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                  {editingId ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2A2A]">
                {canManageAllEntries ? "All MOM entries" : "Your MOM entries"}
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
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#1D2A2A]">
                          {entry.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                            entry.isPublished
                              ? "bg-[#E8F5E8] text-[#285B2A]"
                              : "bg-[#F4EFE3] text-[#8A6417]"
                          }`}
                        >
                          {entry.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#6A7673]">
                        {entry.meetingDate} • saved by {entry.authorName}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-[#7A8682]">
                      {formatDate(entry.updatedAt)}
                    </p>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#32403E]">
                    {entry.minutes}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(entry)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE3E2] px-4 py-2 text-sm font-semibold text-[#32403E] transition hover:bg-[#F6F8F8]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#9A3D3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7F3030]"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#D8E0D8] bg-[#FAFBF9] px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-[#1D2A2A]">
                No MOM entries yet
              </h3>
              <p className="mt-2 text-sm text-[#6A7673]">
                Create your first minutes entry and publish when ready.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
