/**
 * REFERENCE SOLUTION — interviewer eyes only. Never share with candidates.
 *
 * One good answer, not the only one. Key moves:
 * - A single Map does both jobs: lookup, and recency order (Maps iterate in
 *   insertion order, so delete + re-insert moves a key to the "newest" end).
 *   That makes get/set O(1) average with no separate order array.
 * - Time is injected (`now`) so TTL tests don't need to sleep. The default
 *   is wrapped in an arrow so test fake timers that replace Date still apply.
 * - Expired entries are removed lazily on read, and purged before evicting
 *   so an expired entry can never push out a live one.
 */
export interface LRUCacheOptions {
  /** Clock in milliseconds. Defaults to Date.now. */
  now?: () => number;
}

interface Entry<V> {
  value: V;
  expiresAt: number; // Infinity when there is no TTL
}

export class LRUCache<K, V> {
  private readonly entries = new Map<K, Entry<V>>();
  private readonly now: () => number;

  constructor(
    private readonly capacity: number,
    options: LRUCacheOptions = {},
  ) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(`capacity must be a positive integer, got ${capacity}`);
    }
    this.now = options.now ?? (() => Date.now());
  }

  get(key: K): V | undefined {
    const entry = this.liveEntry(key);
    if (entry === undefined) return undefined;
    // Move to the most-recently-used end.
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry.value;
  }

  set(key: K, value: V, ttlMs?: number): void {
    if (ttlMs !== undefined && !(Number.isFinite(ttlMs) && ttlMs > 0)) {
      throw new RangeError(`ttlMs must be a positive finite number, got ${ttlMs}`);
    }
    const expiresAt = ttlMs === undefined ? Infinity : this.now() + ttlMs;

    if (this.entries.has(key)) {
      // Replacing never evicts; delete so the re-insert lands at the MRU end.
      this.entries.delete(key);
    } else if (this.entries.size >= this.capacity) {
      this.purgeExpired();
      if (this.entries.size >= this.capacity) {
        const leastRecent = this.entries.keys().next().value as K;
        this.entries.delete(leastRecent);
      }
    }
    this.entries.set(key, { value, expiresAt });
  }

  has(key: K): boolean {
    // Deliberately does not touch recency.
    return this.liveEntry(key) !== undefined;
  }

  get size(): number {
    this.purgeExpired();
    return this.entries.size;
  }

  private liveEntry(key: K): Entry<V> | undefined {
    const entry = this.entries.get(key);
    if (entry === undefined) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  /** O(n), but only runs when the cache is full or size is read. */
  private purgeExpired(): void {
    const t = this.now();
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= t) this.entries.delete(key);
    }
  }
}
