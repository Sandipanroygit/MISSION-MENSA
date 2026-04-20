import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export interface MeetingMinutesEntry {
  id: string;
  title: string;
  meetingDate: string;
  minutes: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

function normalizeMeetingMinutesEntry(
  entry: Partial<MeetingMinutesEntry>,
): MeetingMinutesEntry {
  const now = new Date().toISOString();
  const createdAt = entry.createdAt || now;
  return {
    id: entry.id || `minutes-${Date.now()}`,
    title: (entry.title || "Untitled Minutes").trim(),
    meetingDate: entry.meetingDate || now.slice(0, 10),
    minutes: (entry.minutes || "").trim(),
    authorName: (entry.authorName || "Mission MENSA").trim(),
    authorEmail: (entry.authorEmail || "team@missionmensa.org")
      .trim()
      .toLowerCase(),
    createdAt,
    updatedAt: entry.updatedAt || createdAt,
    isPublished: Boolean(entry.isPublished),
  };
}

function dedupeMeetingMinutesEntries(entries: Partial<MeetingMinutesEntry>[]) {
  const uniqueEntries = new Map<string, MeetingMinutesEntry>();

  entries.forEach((entry) => {
    const normalizedEntry = normalizeMeetingMinutesEntry(entry);
    uniqueEntries.set(normalizedEntry.id, normalizedEntry);
  });

  return Array.from(uniqueEntries.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function getMeetingMinutesEntries() {
  if (!hasPersistedContentCollection("meetingMinutesDrafts")) {
    return [] as MeetingMinutesEntry[];
  }

  return dedupeMeetingMinutesEntries(
    readContentCollection<MeetingMinutesEntry>("meetingMinutesDrafts", []),
  );
}

export async function getMeetingMinutesEntriesAsync() {
  const localEntries = getMeetingMinutesEntries();
  const remoteEntries = await readRemoteContentCollection<MeetingMinutesEntry>(
    "meetingMinutesDrafts",
    localEntries,
  );

  return dedupeMeetingMinutesEntries(remoteEntries);
}

export function getPublishedMeetingMinutesEntries() {
  return getMeetingMinutesEntries().filter((entry) => entry.isPublished);
}

export async function getPublishedMeetingMinutesEntriesAsync() {
  const entries = await getMeetingMinutesEntriesAsync();
  return entries.filter((entry) => entry.isPublished);
}

export function saveMeetingMinutesEntries(entries: MeetingMinutesEntry[]) {
  saveContentCollection(
    "meetingMinutesDrafts",
    dedupeMeetingMinutesEntries(entries),
  );
}

export async function saveMeetingMinutesEntriesAsync(
  entries: MeetingMinutesEntry[],
) {
  await saveRemoteContentCollection(
    "meetingMinutesDrafts",
    dedupeMeetingMinutesEntries(entries),
  );
}

export function upsertMeetingMinutesEntry(entry: MeetingMinutesEntry) {
  const updatedEntries = dedupeMeetingMinutesEntries([
    normalizeMeetingMinutesEntry(entry),
    ...getMeetingMinutesEntries().filter((item) => item.id !== entry.id),
  ]);
  saveMeetingMinutesEntries(updatedEntries);
  return updatedEntries;
}

export async function upsertMeetingMinutesEntryAsync(entry: MeetingMinutesEntry) {
  const currentEntries = await getMeetingMinutesEntriesAsync();
  const updatedEntries = dedupeMeetingMinutesEntries([
    normalizeMeetingMinutesEntry(entry),
    ...currentEntries.filter((item) => item.id !== entry.id),
  ]);
  await saveMeetingMinutesEntriesAsync(updatedEntries);
  return getMeetingMinutesEntries();
}

export function deleteMeetingMinutesEntry(id: string) {
  const updatedEntries = getMeetingMinutesEntries().filter(
    (entry) => entry.id !== id,
  );
  saveMeetingMinutesEntries(updatedEntries);
  return updatedEntries;
}

export async function deleteMeetingMinutesEntryAsync(id: string) {
  const currentEntries = await getMeetingMinutesEntriesAsync();
  const updatedEntries = currentEntries.filter((entry) => entry.id !== id);
  await saveMeetingMinutesEntriesAsync(updatedEntries);
  return getMeetingMinutesEntries();
}
