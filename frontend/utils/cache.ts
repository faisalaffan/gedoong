import Dexie, { type Table } from "dexie";

interface CacheEntry {
  key: string;
  value: any;
  storedAt: number;
  ttlMs: number;
}

class ListingCacheDB extends Dexie {
  cache!: Table<CacheEntry, string>;

  constructor() {
    super("GedoongCache");
    this.version(1).stores({
      cache: "&key, storedAt",
    });
  }
}

const db = new ListingCacheDB();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.storedAt > entry.ttlMs;
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  try {
    const entry = await db.cache.get(key);
    if (!entry) return null;
    if (isExpired(entry)) {
      db.cache.delete(key); // fire-and-forget cleanup
      return null;
    }
    return entry.value as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttlMs = DEFAULT_TTL): Promise<void> {
  try {
    await db.cache.put({
      key,
      value,
      storedAt: Date.now(),
      ttlMs,
    });
  } catch {
    // silently fail — cache is non-critical
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await db.cache.delete(key);
  } catch {
    // silently fail
  }
}

/** Stale-while-revalidate: return cached data immediately, then refresh via fetcher */
export async function cacheSWR<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL,
): Promise<{ data: T | null; fromCache: boolean }> {
  const cached = await cacheGet<T>(key);
  if (cached) {
    // Revalidate in background
    fetcher()
      .then((fresh) => cacheSet(key, fresh, ttlMs))
      .catch(() => {});
    return { data: cached, fromCache: true };
  }
  const fresh = await fetcher();
  cacheSet(key, fresh, ttlMs); // fire-and-forget
  return { data: fresh, fromCache: false };
}
