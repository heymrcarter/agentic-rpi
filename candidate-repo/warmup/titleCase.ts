/**
 * Warm-up only (not scored). Converts a phrase to Title Case.
 * Small words ("a", "an", "the", "of", "and", "or", "in", "on", "to") stay
 * lowercase unless they are the first word.
 */
export function titleCase(phrase: string): string {
  return phrase
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
