import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export type VoiceAudience = "Parent" | "Student";

export interface VoiceEntry {
  id: string;
  authorName: string;
  authorEmail: string;
  speakerName: string;
  audience: VoiceAudience;
  location: string;
  quote: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

const SEEDED_VOICES: VoiceEntry[] = [];

function normalizeVoiceEntry(entry: VoiceEntry): VoiceEntry {
  return {
    ...entry,
    authorEmail: entry.authorEmail.trim().toLowerCase(),
    speakerName: entry.speakerName.trim(),
    location: entry.location.trim(),
    quote: entry.quote.trim(),
    updatedAt: entry.updatedAt || entry.createdAt,
  };
}

function dedupeVoiceEntries(entries: VoiceEntry[]) {
  const uniqueEntries = new Map<string, VoiceEntry>();

  entries.forEach((entry) => {
    uniqueEntries.set(entry.id, normalizeVoiceEntry(entry));
  });

  return Array.from(uniqueEntries.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

function mergeSeededVoices(entries: VoiceEntry[]) {
  if (!entries.length) {
    return dedupeVoiceEntries([...SEEDED_VOICES]);
  }

  const merged = new Map<string, VoiceEntry>();
  SEEDED_VOICES.forEach((entry) => merged.set(entry.id, entry));
  entries.forEach((entry) => merged.set(entry.id, normalizeVoiceEntry(entry)));
  return dedupeVoiceEntries(Array.from(merged.values()));
}

export function getVoiceEntries() {
  if (!hasPersistedContentCollection("voiceEntries")) {
    return mergeSeededVoices([]);
  }

  return mergeSeededVoices(readContentCollection<VoiceEntry>("voiceEntries", []));
}

export async function getVoiceEntriesAsync() {
  const localEntries = getVoiceEntries();
  const remoteEntries = await readRemoteContentCollection<VoiceEntry>(
    "voiceEntries",
    localEntries,
  );

  const mergedEntries = mergeSeededVoices([...localEntries, ...remoteEntries]);
  saveContentCollection("voiceEntries", mergedEntries);
  return mergedEntries;
}

export function getPublishedVoiceEntries() {
  return getVoiceEntries().filter((entry) => entry.isPublished);
}

export async function getPublishedVoiceEntriesAsync() {
  const entries = await getVoiceEntriesAsync();
  return entries.filter((entry) => entry.isPublished);
}

export function saveVoiceEntries(entries: VoiceEntry[]) {
  saveContentCollection("voiceEntries", dedupeVoiceEntries(entries));
}

export async function saveVoiceEntriesAsync(entries: VoiceEntry[]) {
  await saveRemoteContentCollection("voiceEntries", dedupeVoiceEntries(entries));
}

export function upsertVoiceEntry(entry: VoiceEntry) {
  const updatedEntries = dedupeVoiceEntries([
    normalizeVoiceEntry(entry),
    ...getVoiceEntries().filter((item) => item.id !== entry.id),
  ]);
  saveVoiceEntries(updatedEntries);
  return updatedEntries;
}

export async function upsertVoiceEntryAsync(entry: VoiceEntry) {
  const currentEntries = await getVoiceEntriesAsync();
  const updatedEntries = dedupeVoiceEntries([
    normalizeVoiceEntry(entry),
    ...currentEntries.filter((item) => item.id !== entry.id),
  ]);
  await saveVoiceEntriesAsync(updatedEntries);
  return mergeSeededVoices([...updatedEntries, ...getVoiceEntries()]);
}

export function deleteVoiceEntry(id: string) {
  const updatedEntries = getVoiceEntries().filter((entry) => entry.id !== id);
  saveVoiceEntries(updatedEntries);
  return updatedEntries;
}

export async function deleteVoiceEntryAsync(id: string) {
  const currentEntries = await getVoiceEntriesAsync();
  const updatedEntries = currentEntries.filter((entry) => entry.id !== id);
  await saveVoiceEntriesAsync(updatedEntries);
  return mergeSeededVoices([...updatedEntries, ...getVoiceEntries()]);
}
