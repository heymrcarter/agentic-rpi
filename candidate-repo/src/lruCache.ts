/**
 * Fixed-capacity least-recently-used (LRU) cache.
 *
 * Keeps at most `capacity` entries. When the cache is full and a new entry is
 * added, the least recently used entry is evicted to make room.
 *
 * Implementation notes:
 * - `store` holds the key/value pairs for O(1) lookup.
 * - `order` tracks keys from least to most recently used, so the eviction
 *   candidate is always at the front of the array.
 */
export class LRUCache<K, V> {
  private readonly store = new Map<K, V>();
  private readonly order: K[] = [];

  constructor(private readonly capacity: number) {}

  /** Returns the value for `key`, or `undefined` if it is not cached. */
  get(key: K): V | undefined {
    return this.store.get(key);
  }

  /**
   * Adds or updates an entry. If the cache is full, the least recently used
   * entry is evicted first.
   */
  set(key: K, value: V): void {
    if (this.order.length >= this.capacity) {
      const oldest = this.order.shift() as K;
      this.store.delete(oldest);
    }
    this.store.set(key, value);
    this.order.push(key);
  }

  /** Returns true if `key` is currently cached. */
  has(key: K): boolean {
    return this.store.has(key);
  }

  /** Number of entries currently cached. */
  get size(): number {
    return this.order.length;
  }
}
