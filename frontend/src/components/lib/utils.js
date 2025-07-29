import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges them with Tailwind-merge.
 *
 * @param {...any} inputs - Class names or expressions to merge.
 * @returns {string} - The resulting class names string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
