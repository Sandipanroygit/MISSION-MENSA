import { MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { createId, formatDate } from "./discussionData";
import {
  deleteVoiceEntry,
  deleteVoiceEntryAsync,
  getVoiceEntries,
  getVoiceEntriesAsync,
  saveVoiceEntries,
  type VoiceAudience,
  type VoiceEntry,
  upsertVoiceEntry,
  upsertVoiceEntryAsync,
} from "./voiceData";
import { confirmPermanentDelete } from "@/utils/confirmDelete";

const VOICES_ADMIN_EMAIL = "sandipan.roy@indusschool.com";

const emptyForm = {
  speakerName: "",
  audience: "Parent" as VoiceAudience,
  location: "",
  quote: "",
};

export default function VoicesDraftPage() {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<VoiceEntry[]>(() => getVoiceEntries());
  const [speakerName, setSpeakerName] = useState(emptyForm.speakerName);
  const [audience, setAudience] = useState<VoiceAudience>(emptyForm.audience);
  const [location, setLocation] = useState(emptyForm.location);
  const [quote, setQuote] = useState(emptyForm.quote);
  const [isPublished, setIsPublished] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isVoicesAdmin =
    user?.email?.trim().toLowerCase() === VOICES_ADMIN_EMAIL;

  useEffect(() => {
    void getVoiceEntriesAsync().then(setEntries).catch(() => {
      setSaveMessage("Unable to load voices from Supabase right now.");
    });
  }, []);

  const visibleEntries = useMemo(() => {
    if (isVoicesAdmin) {
      return entries;
    }

    return entries.filter(
      (entry) => entry.authorEmail === user?.email?.trim().toLowerCase(),
    );
  }, [entries, isVoicesAdmin, user?.email]);

  function resetForm() {
    setSpeakerName(emptyForm.speakerName);
    setAudience(emptyForm.audience);
    setLocation(emptyForm.location);
    setQuote(emptyForm.quote);
    setIsPublished(false);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !speakerName.trim() || !location.trim() || !quote.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const entry: VoiceEntry = {
      id: editingId ?? createId(),
      authorName: user.name,
      authorEmail: user.email,
      speakerName: speakerName.trim(),
      audience,
      location: location.trim(),
      quote: quote.trim(),
      createdAt:
        entries.find((item) => item.id === editingId)?.createdAt ?? now,
      updatedAt: now,
      isPublished,
    };

    const previousEntries = entries;
    const optimisticEntries = upsertVoiceEntry(entry);
    setEntries(optimisticEntries);
    try {
      const syncedEntries = await upsertVoiceEntryAsync(entry);
      setEntries(syncedEntries);
      setSaveMessage(
        isPublished
          ? "Voice saved, published, and synced to Supabase."
          : "Voice saved as draft and synced to Supabase.",
      );
      resetForm();
    } catch {
      setEntries(previousEntries);
      saveVoiceEntries(previousEntries);
      setSaveMessage("Supabase sync failed. Entry not confirmed. Please retry.");
    }
  }

  function handleEdit(entry: VoiceEntry) {
    setEditingId(entry.id);
    setSpeakerName(entry.speakerName);
    setAudience(entry.audience);
    setLocation(entry.location);
    setQuote(entry.quote);
    setIsPublished(entry.isPublished);
    setSaveMessage(null);
  }

  async function handleDelete(id: string) {
    if (!confirmPermanentDelete()) return;
    const previousEntries = entries;
    const updatedEntries = deleteVoiceEntry(id);
    setEntries(updatedEntries);
    if (editingId === id) {
      resetForm();
    }
    try {
      const syncedEntries = await deleteVoiceEntryAsync(id);
      setEntries(syncedEntries);
      setSaveMessage("Entry deleted and synced.");
    } catch {
      setEntries(previousEntries);
      saveVoiceEntries(previousEntries);
      setSaveMessage("Supabase sync failed while deleting. Please retry.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-[#123629]/10 bg-[linear-gradient(135deg,#F9FBFF_0%,#FFFFFF_46%,#E8F1F3_100%)] p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#17353F]/8 px-3 py-1 text-sm font-medium text-[#17353F]">
          <MessageSquareQuote size={16} />
          Parent And Student Voices
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#1D2A2A]">
          Draft and publish public testimonials
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5D6B68] sm:text-base">
          This is separate from technical feedback. Entries saved here are for
          the public parent and student voices page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="rounded-[2rem] border border-[#E7ECE7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2A2A]">
                {editingId ? "Edit voice entry" : "New voice entry"}
              </h2>
              <p className="mt-1 text-sm text-[#6A7673]">
                Add parent or student quotes that can appear on the public
                voices page.
              </p>
            </div>
            <div className="rounded-full bg-[#17353F]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#17353F]">
              Draft Setup
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <input
              value={speakerName}
              onChange={(event) => setSpeakerName(event.target.value)}
              placeholder="Speaker name"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value as VoiceAudience)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
              >
                <option value="Parent">Parent</option>
                <option value="Student">Student</option>
              </select>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, grade, or descriptor"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
              />
            </div>

            <textarea
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
              placeholder="Write the voice quote here..."
              rows={7}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-7 text-[#1D2A2A] outline-none transition focus:border-[#17353F]"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-[#E7ECE7] bg-[#FAFBFC] px-4 py-3 text-sm text-[#32403E]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#17353F] focus:ring-[#17353F]"
              />
              Publish this entry to the public voices page
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
                {isVoicesAdmin ? "All voice entries" : "Your voice entries"}
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
                          {entry.speakerName}
                        </h3>
                        <span className="rounded-full bg-[#17353F]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#17353F]">
                          {entry.audience}
                        </span>
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
                        {entry.location} · saved by {entry.authorName}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-[#7A8682]">
                      {formatDate(entry.updatedAt)}
                    </p>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#32403E]">
                    {entry.quote}
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
                No voice entries yet
              </h3>
              <p className="mt-2 text-sm text-[#6A7673]">
                Create a parent or student quote here and publish it when ready.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
