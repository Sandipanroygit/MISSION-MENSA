import { supabase } from "@/lib/supabase";

type ContentCollectionKey =
  | "publishedBlogs"
  | "discussionTopics"
  | "feedbackEntries"
  | "voiceEntries"
  | "trustedDevices"
  | "meetingMinutesDrafts";

interface ContentDatabase {
  publishedBlogs: unknown[];
  discussionTopics: unknown[];
  feedbackEntries: unknown[];
  voiceEntries: unknown[];
  trustedDevices: unknown[];
  meetingMinutesDrafts: unknown[];
  updatedAt: string;
}

const CONTENT_DATABASE_KEY = "mission-mensa-content-database";
const CONTENT_COLLECTIONS_TABLE = "content_collections";

function createEmptyDatabase(): ContentDatabase {
  return {
    publishedBlogs: [],
    discussionTopics: [],
    feedbackEntries: [],
    voiceEntries: [],
    trustedDevices: [],
    meetingMinutesDrafts: [],
    updatedAt: new Date().toISOString(),
  };
}

export function readContentDatabase(): ContentDatabase {
  if (typeof window === "undefined") {
    return createEmptyDatabase();
  }

  try {
    const rawDatabase = window.localStorage.getItem(CONTENT_DATABASE_KEY);
    if (!rawDatabase) {
      return createEmptyDatabase();
    }

    const parsedDatabase = JSON.parse(rawDatabase) as Partial<ContentDatabase>;

    return {
      publishedBlogs: Array.isArray(parsedDatabase.publishedBlogs)
        ? parsedDatabase.publishedBlogs
        : [],
      discussionTopics: Array.isArray(parsedDatabase.discussionTopics)
        ? parsedDatabase.discussionTopics
        : [],
      feedbackEntries: Array.isArray(parsedDatabase.feedbackEntries)
        ? parsedDatabase.feedbackEntries
        : [],
      voiceEntries: Array.isArray(parsedDatabase.voiceEntries)
        ? parsedDatabase.voiceEntries
        : [],
      trustedDevices: Array.isArray(parsedDatabase.trustedDevices)
        ? parsedDatabase.trustedDevices
        : [],
      meetingMinutesDrafts: Array.isArray(parsedDatabase.meetingMinutesDrafts)
        ? parsedDatabase.meetingMinutesDrafts
        : [],
      updatedAt: parsedDatabase.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createEmptyDatabase();
  }
}

export function hasPersistedContentCollection(key: ContentCollectionKey) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const rawDatabase = window.localStorage.getItem(CONTENT_DATABASE_KEY);
    if (!rawDatabase) {
      return false;
    }

    const parsedDatabase = JSON.parse(rawDatabase) as Partial<ContentDatabase>;
    return Array.isArray(parsedDatabase[key]);
  } catch {
    return false;
  }
}

export function saveContentDatabase(database: ContentDatabase) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CONTENT_DATABASE_KEY,
    JSON.stringify({ ...database, updatedAt: new Date().toISOString() }),
  );
}

export function readContentCollection<T>(
  key: ContentCollectionKey,
  fallback: T[] = [],
): T[] {
  const database = readContentDatabase();
  const collection = database[key];

  if (!Array.isArray(collection) || collection.length === 0) {
    return fallback;
  }

  return collection as T[];
}

export function saveContentCollection<T>(
  key: ContentCollectionKey,
  collection: T[],
) {
  const database = readContentDatabase();
  saveContentDatabase({
    ...database,
    [key]: collection,
  });
}

export async function readRemoteContentCollection<T>(
  key: ContentCollectionKey,
  fallback: T[] = [],
) {
  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from(CONTENT_COLLECTIONS_TABLE)
    .select("items")
    .eq("key", key)
    .maybeSingle();

  if (error || !Array.isArray(data?.items)) {
    return fallback;
  }

  return data.items as T[];
}

export async function saveRemoteContentCollection<T>(
  key: ContentCollectionKey,
  collection: T[],
  options?: {
    throwOnError?: boolean;
  },
) {
  saveContentCollection(key, collection);

  if (!supabase) {
    if (options?.throwOnError) {
      throw new Error("Supabase is not configured.");
    }
    return;
  }

  const { error } = await supabase.from(CONTENT_COLLECTIONS_TABLE).upsert({
    key,
    items: collection,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.warn(`Failed to save ${key} to Supabase`, error);
    if (options?.throwOnError) {
      throw new Error(`Failed to sync ${key} to Supabase: ${error.message}`);
    }
  }
}
