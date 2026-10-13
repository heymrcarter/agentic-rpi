import { describe, expect, it } from "vitest";
import { LRUCache } from "../src/lruCache";

describe("LRUCache", () => {
  it("returns a value that was set", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
  });

  it("returns undefined for a missing key", () => {
    const cache = new LRUCache<string, number>(2);
    expect(cache.get("missing")).toBeUndefined();
    expect(cache.has("missing")).toBe(false);
  });

  it("evicts the oldest entry when capacity is exceeded", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.has("a")).toBe(false);
    expect(cache.has("b")).toBe(true);
    expect(cache.has("c")).toBe(true);
  });

  it("reports its size", () => {
    const cache = new LRUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    expect(cache.size).toBe(2);
  });
});
