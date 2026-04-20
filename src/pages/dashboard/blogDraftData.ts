import {
  readContentCollection,
  readRemoteContentCollection,
  saveContentCollection,
  saveRemoteContentCollection,
} from "@/backend/contentStore";

export interface BlogDraftEntry {
  authorEmail: string;
  title: string;
  summary: string;
  editingSlug?: string | null;
  fontFamily: string;
  fontSize: string;
  lineSpacing: number;
  paragraphSpacing: number;
  content: string;
  coverImage: string;
  hasCustomCover: boolean;
  savedAt: string;
}

function normalizeDraftEntry(entry: BlogDraftEntry): BlogDraftEntry {
  return {
    ...entry,
    authorEmail: entry.authorEmail.trim().toLowerCase(),
    title: entry.title.trim(),
    summary: entry.summary.trim(),
    editingSlug: entry.editingSlug?.trim() || null,
    coverImage: entry.coverImage.trim(),
    savedAt: entry.savedAt || new Date().toISOString(),
  };
}

function mergeDraftEntries(entries: BlogDraftEntry[]) {
  const merged = new Map<string, BlogDraftEntry>();

  entries
    .map(normalizeDraftEntry)
    .filter((entry) => Boolean(entry.authorEmail))
    .forEach((entry) => {
      const existing = merged.get(entry.authorEmail);
      if (!existing || entry.savedAt > existing.savedAt) {
        merged.set(entry.authorEmail, entry);
      }
    });

  return Array.from(merged.values()).sort((a, b) =>
    b.savedAt.localeCompare(a.savedAt),
  );
}

function getDraftIdentity(email?: string | null) {
  return email?.trim().toLowerCase() || "guest";
}

export function getBlogDraftEntries() {
  return mergeDraftEntries(readContentCollection<BlogDraftEntry>("blogDrafts", []));
}

export async function getBlogDraftEntriesAsync() {
  const localEntries = getBlogDraftEntries();
  const remoteEntries = await readRemoteContentCollection<BlogDraftEntry>(
    "blogDrafts",
    localEntries,
  );
  const mergedEntries = mergeDraftEntries([...localEntries, ...remoteEntries]);
  saveContentCollection("blogDrafts", mergedEntries);
  return mergedEntries;
}

export function getBlogDraftByEmail(email?: string | null) {
  const identity = getDraftIdentity(email);
  return getBlogDraftEntries().find((entry) => entry.authorEmail === identity) ?? null;
}

export async function getBlogDraftByEmailAsync(email?: string | null) {
  const identity = getDraftIdentity(email);
  const entries = await getBlogDraftEntriesAsync();
  return entries.find((entry) => entry.authorEmail === identity) ?? null;
}

export function upsertBlogDraftEntry(entry: BlogDraftEntry) {
  const normalizedEntry = normalizeDraftEntry(entry);
  const updatedEntries = mergeDraftEntries([
    normalizedEntry,
    ...getBlogDraftEntries().filter(
      (existing) => existing.authorEmail !== normalizedEntry.authorEmail,
    ),
  ]);
  saveContentCollection("blogDrafts", updatedEntries);
  return normalizedEntry;
}

export async function upsertBlogDraftEntryAsync(
  entry: BlogDraftEntry,
  options?: { requireRemoteSync?: boolean },
) {
  const normalizedEntry = normalizeDraftEntry(entry);
  const currentEntries = await getBlogDraftEntriesAsync();
  const updatedEntries = mergeDraftEntries([
    normalizedEntry,
    ...currentEntries.filter(
      (existing) => existing.authorEmail !== normalizedEntry.authorEmail,
    ),
  ]);
  await saveRemoteContentCollection("blogDrafts", updatedEntries, {
    throwOnError: options?.requireRemoteSync ?? false,
  });
  return normalizedEntry;
}

export function deleteBlogDraftByEmail(email?: string | null) {
  const identity = getDraftIdentity(email);
  const updatedEntries = getBlogDraftEntries().filter(
    (entry) => entry.authorEmail !== identity,
  );
  saveContentCollection("blogDrafts", updatedEntries);
}

export async function deleteBlogDraftByEmailAsync(
  email?: string | null,
  options?: { requireRemoteSync?: boolean },
) {
  const identity = getDraftIdentity(email);
  const currentEntries = await getBlogDraftEntriesAsync();
  const updatedEntries = currentEntries.filter(
    (entry) => entry.authorEmail !== identity,
  );
  await saveRemoteContentCollection("blogDrafts", updatedEntries, {
    throwOnError: options?.requireRemoteSync ?? false,
  });
}
