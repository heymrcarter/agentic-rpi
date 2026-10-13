import { describe, expect, it } from "vitest";
import { titleCase } from "./titleCase";

// Warm-up only (not scored): one of these fails on purpose.
// Use the agent to make it pass so you're comfortable with the tool.
describe("titleCase (warm-up)", () => {
  it("capitalizes each word", () => {
    expect(titleCase("hello big world")).toBe("Hello Big World");
  });

  it("keeps small words lowercase unless they come first", () => {
    expect(titleCase("the lord of the rings")).toBe("The Lord of the Rings");
  });
});
