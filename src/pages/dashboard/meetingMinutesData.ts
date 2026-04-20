import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export interface MeetingMinutesDraft {
  id: string;
  title: string;
  meetingDate: string;
  minutes: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeMeetingMinutesDraft(
  entry: MeetingMinutesDraft,
): MeetingMinutesDraft {
  return {
    ...entry,
    title: entry.title.trim(),
    minutes: entry.minutes.trim(),
    authorEmail: entry.authorEmail.trim().toLowerCase(),
  };
}

function dedupeMeetingMinutesDrafts(entries: MeetingMinutesDraft[]) {
  const uniqueEntries = new Map<string, MeetingMinutesDraft>();

  entries.forEach((entry) => {
    uniqueEntries.set(entry.id, normalizeMeetingMinutesDraft(entry));
  });

  return Array.from(uniqueEntries.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function getMeetingMinutesDrafts() {
  if (!hasPersistedContentCollection("meetingMinutesDrafts")) {
    return [] as MeetingMinutesDraft[];
  }

  return dedupeMeetingMinutesDrafts(
    readContentCollection<MeetingMinutesDraft>("meetingMinutesDrafts", []),
  );
}

export async function getMeetingMinutesDraftsAsync() {
  const localEntries = getMeetingMinutesDrafts();
  const remoteEntries = await readRemoteContentCollection<MeetingMinutesDraft>(
    "meetingMinutesDrafts",
    localEntries,
  );

  return dedupeMeetingMinutesDrafts(remoteEntries);
}

export function saveMeetingMinutesDrafts(entries: MeetingMinutesDraft[]) {
  saveContentCollection(
    "meetingMinutesDrafts",
    dedupeMeetingMinutesDrafts(entries),
  );
}

export async function saveMeetingMinutesDraftsAsync(
  entries: MeetingMinutesDraft[],
) {
  await saveRemoteContentCollection(
    "meetingMinutesDrafts",
    dedupeMeetingMinutesDrafts(entries),
  );
}

export function upsertMeetingMinutesDraft(entry: MeetingMinutesDraft) {
  const updatedEntries = dedupeMeetingMinutesDrafts([
    normalizeMeetingMinutesDraft(entry),
    ...getMeetingMinutesDrafts(),
  ]);
  saveMeetingMinutesDrafts(updatedEntries);
  return updatedEntries;
}

export async function upsertMeetingMinutesDraftAsync(entry: MeetingMinutesDraft) {
  const currentEntries = await getMeetingMinutesDraftsAsync();
  const updatedEntries = dedupeMeetingMinutesDrafts([
    normalizeMeetingMinutesDraft(entry),
    ...currentEntries,
  ]);
  await saveMeetingMinutesDraftsAsync(updatedEntries);
  return getMeetingMinutesDrafts();
}
