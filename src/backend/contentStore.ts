type ContentCollectionKey = "publishedBlogs" | "discussionTopics";

interface ContentDatabase {
  publishedBlogs: unknown[];
  discussionTopics: unknown[];
  updatedAt: string;
}

const CONTENT_DATABASE_KEY = "mission-mensa-content-database";

function createEmptyDatabase(): ContentDatabase {
  return {
    publishedBlogs: [],
    discussionTopics: [],
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
