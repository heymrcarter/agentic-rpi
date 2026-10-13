/**
 * HIDDEN ACCEPTANCE SUITE — interviewer eyes only. Never share with candidates.
 *
 * Run after the session with `./score.sh <candidate-repo>`. The script copies
 * this file to <repo>/test/__acceptance__/ and runs it against the
 * candidate's src/lruCache.ts.
 *
 * Groups:
 *   core  — the README spec (Parts 1–2). Every test traces to a spec line.
 *   ttl   — the Part 3 change card. Only meaningful if Part 3 was reached.
 *   perf  — informational only. A fail is a prompt to read the code, not a verdict.
 *
 * Time is controlled with fake timers, so these tests work whether the
 * candidate injected a clock (defaulting to Date.now / performance.now) or
 * called Date.now directly.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LRUCache } from "../../src/lruCache";

// The candidate's signature may still be (key, value) if Part 3 wasn't reached.
type TtlSet<K, V> = (key: K, value: V, ttlMs?: number) => void;
function setWithTtl<K, V>(cache: LRUCache<K, V>, key: K, value: V, ttlMs?: number) {
  (cache.set as unknown as TtlSet<K, V>).call(cache, key, value, ttlMs);
}

describe("core: construction", () => {
  it.each([0, -1, 1.5, Number.NaN])("rejects capacity %s with a RangeError", (capacity) => {
    expect(() => new LRUCache<string, number>(capacity)).toThrow(RangeError);
  });

  it("works with capacity 1", () => {
    const cache = new LRUCache<string, number>(1);
    cache.set("a", 1);
    cache.set("b", 2);
    expect(cache.has("a")).toBe(false);
    expect(cache.get("b")).toBe(2);
    expect(cache.size).toBe(1);
  });
});

describe("core: recency", () => {
  it("get makes a key most recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a");
    cache.set("c", 3);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(false);
    expect(cache.has("c")).toBe(true);
  });

  it("has does not change recency", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.has("a");
    cache.set("c", 3);
    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(true);
  });

  it("set on an existing key makes it most recently used", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10);
    cache.set("c", 3);
    expect(cache.get("a")).toBe(10);
    expect(cache.has("b")).toBe(false);
  });

  it("evicts in least-recently-used order across mixed operations", () => {
    const cache = new LRUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    cache.get("a"); // order: b, c, a
    cache.set("b", 20); // order: c, a, b
    cache.set("d", 4); // evicts c
    expect(cache.has("c")).toBe(false);
    cache.set("e", 5); // evicts a
    expect(cache.has("a")).toBe(false);
    expect(cache.get("b")).toBe(20);
    expect(cache.get("d")).toBe(4);
    expect(cache.get("e")).toBe(5);
  });
});

describe("core: replacing values", () => {
  it("replaces the value of an existing key", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("a", 2);
    expect(cache.get("a")).toBe(2);
  });

  it("replacing a key does not grow size", () => {
    const cache = new LRUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("a", 2);
    cache.set("a", 3);
    expect(cache.size).toBe(1);
  });

  it("replacing a key in a full cache evicts nothing", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("b", 20);
    expect(cache.has("a")).toBe(true);
    expect(cache.has("b")).toBe(true);
    expect(cache.size).toBe(2);
  });

  it("a recently updated key is not evicted ahead of older keys", () => {
    const cache = new LRUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10); // a is now newer than b
    cache.set("c", 3); // not full yet: nothing evicted
    expect(cache.get("a")).toBe(10);
    cache.set("d", 4); // full: evicts b
    expect(cache.has("b")).toBe(false);
    expect(cache.has("a")).toBe(true);
  });
});

describe("core: values", () => {
  it("stores falsy values", () => {
    const cache = new LRUCache<string, number | string | boolean>(3);
    cache.set("zero", 0);
    cache.set("empty", "");
    cache.set("no", false);
    expect(cache.get("zero")).toBe(0);
    expect(cache.get("empty")).toBe("");
    expect(cache.get("no")).toBe(false);
    expect(cache.size).toBe(3);
  });

  it("size counts distinct live entries", () => {
    const cache = new LRUCache<string, number>(3);
    ["a", "b", "a", "c", "b", "d", "e"].forEach((k, i) => cache.set(k, i));
    expect(cache.size).toBe(3);
  });
});

describe("ttl: expiry", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["Date", "performance", "setTimeout", "clearTimeout", "setInterval", "clearInterval"],
    });
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("an entry without a ttl never expires", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1);
    vi.advanceTimersByTime(10 * 365 * 24 * 60 * 60 * 1000);
    expect(cache.get("a")).toBe(1);
  });

  it("an entry is still live just before its ttl", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1, 1000);
    vi.advanceTimersByTime(999);
    expect(cache.get("a")).toBe(1);
    expect(cache.has("a")).toBe(true);
  });

  it("an expired entry behaves as if absent for get and has", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1, 1000);
    vi.advanceTimersByTime(1001);
    expect(cache.has("a")).toBe(false);
    expect(cache.get("a")).toBeUndefined();
  });

  it("expired entries are not counted in size", () => {
    const cache = new LRUCache<string, number>(3);
    setWithTtl(cache, "a", 1, 1000);
    setWithTtl(cache, "b", 2);
    vi.advanceTimersByTime(1001);
    expect(cache.size).toBe(1);
  });

  it("ttl is measured from when the entry was set", () => {
    const cache = new LRUCache<string, number>(2);
    vi.advanceTimersByTime(5000);
    setWithTtl(cache, "a", 1, 1000);
    vi.advanceTimersByTime(999);
    expect(cache.get("a")).toBe(1);
  });

  it("setting an existing key replaces its ttl", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1, 1000);
    vi.advanceTimersByTime(800);
    setWithTtl(cache, "a", 2, 1000);
    vi.advanceTimersByTime(800);
    expect(cache.get("a")).toBe(2);
  });

  it("setting an existing key without a ttl clears its expiry", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1, 1000);
    setWithTtl(cache, "a", 2);
    vi.advanceTimersByTime(5000);
    expect(cache.get("a")).toBe(2);
  });

  it("an expired entry never causes a live entry to be evicted", () => {
    const cache = new LRUCache<string, number>(2);
    setWithTtl(cache, "a", 1); // live, least recently used
    setWithTtl(cache, "b", 2, 100); // most recently used, about to expire
    vi.advanceTimersByTime(200);
    setWithTtl(cache, "c", 3);
    expect(cache.get("a")).toBe(1);
    expect(cache.get("c")).toBe(3);
    expect(cache.size).toBe(2);
  });

  it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])("rejects ttl %s with a RangeError", (ttl) => {
    const cache = new LRUCache<string, number>(2);
    expect(() => setWithTtl(cache, "a", 1, ttl)).toThrow(RangeError);
  });
});

describe("perf: informational", () => {
  it("handles 40k entries and 100k mixed operations quickly", () => {
    const capacity = 40_000;
    const cache = new LRUCache<number, number>(capacity);
    for (let i = 0; i < capacity; i++) cache.set(i, i);

    // Deterministic pseudo-random keys, roughly half hits and half misses.
    let seed = 42;
    const next = () => (seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648);

    const start = performance.now();
    for (let i = 0; i < 100_000; i++) {
      const key = next() % (capacity * 2);
      if (i % 2 === 0) cache.get(key);
      else cache.set(key, i);
    }
    const elapsed = performance.now() - start;
    expect(elapsed, `took ${Math.round(elapsed)}ms`).toBeLessThan(1500);
  }, 60_000);
});
