import {
  hasPersistedContentCollection,
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export interface FeedbackEntry {
  id: string;
  authorName: string;
  authorEmail: string;
  recipientEmail?: string;
  subject: string;
  message: string;
  createdAt: string;
}

const DEFAULT_FEEDBACK_RECIPIENT = "sandipan.roy@indusschool.com";

function normalizeFeedbackEntry(entry: FeedbackEntry): FeedbackEntry {
  return {
    ...entry,
    authorEmail: entry.authorEmail.trim().toLowerCase(),
    recipientEmail: (entry.recipientEmail ?? DEFAULT_FEEDBACK_RECIPIENT)
      .trim()
      .toLowerCase(),
    subject: entry.subject.trim(),
    message: entry.message.trim(),
  };
}

function dedupeFeedbackEntries(entries: FeedbackEntry[]) {
  const uniqueEntries = new Map<string, FeedbackEntry>();

  entries.forEach((entry) => {
    uniqueEntries.set(entry.id, normalizeFeedbackEntry(entry));
  });

  return Array.from(uniqueEntries.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getFeedbackEntries() {
  if (!hasPersistedContentCollection("feedbackEntries")) {
    return [] as FeedbackEntry[];
  }

  return dedupeFeedbackEntries(
    readContentCollection<FeedbackEntry>("feedbackEntries", []),
  );
}

export async function getFeedbackEntriesAsync() {
  const localEntries = getFeedbackEntries();
  const remoteEntries = await readRemoteContentCollection<FeedbackEntry>(
    "feedbackEntries",
    localEntries,
  );

  const mergedEntries = dedupeFeedbackEntries([...remoteEntries, ...localEntries]);
  saveContentCollection("feedbackEntries", mergedEntries);
  return mergedEntries;
}

export function saveFeedbackEntries(entries: FeedbackEntry[]) {
  saveContentCollection("feedbackEntries", dedupeFeedbackEntries(entries));
}

export async function saveFeedbackEntriesAsync(
  entries: FeedbackEntry[],
  options?: { requireRemoteSync?: boolean },
) {
  await saveRemoteContentCollection(
    "feedbackEntries",
    dedupeFeedbackEntries(entries),
    { throwOnError: options?.requireRemoteSync ?? false },
  );
}

export function addFeedbackEntry(entry: FeedbackEntry) {
  const updatedEntries = dedupeFeedbackEntries([
    normalizeFeedbackEntry(entry),
    ...getFeedbackEntries(),
  ]);
  saveFeedbackEntries(updatedEntries);
  return updatedEntries;
}

export async function addFeedbackEntryAsync(entry: FeedbackEntry) {
  const currentEntries = await getFeedbackEntriesAsync();
  const updatedEntries = dedupeFeedbackEntries([
    normalizeFeedbackEntry(entry),
    ...currentEntries,
  ]);
  await saveFeedbackEntriesAsync(updatedEntries, { requireRemoteSync: true });
  return dedupeFeedbackEntries([...updatedEntries, ...getFeedbackEntries()]);
}

export function deleteFeedbackEntry(id: string) {
  const updatedEntries = getFeedbackEntries().filter((entry) => entry.id !== id);
  saveFeedbackEntries(updatedEntries);
  return updatedEntries;
}

export async function deleteFeedbackEntryAsync(id: string) {
  const currentEntries = await getFeedbackEntriesAsync();
  const updatedEntries = currentEntries.filter((entry) => entry.id !== id);
  await saveFeedbackEntriesAsync(updatedEntries, { requireRemoteSync: true });
  return dedupeFeedbackEntries([...updatedEntries, ...getFeedbackEntries()]);
}
