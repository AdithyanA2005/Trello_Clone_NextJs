import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using `clsx` and merges them with `tailwind-merge` to avoid duplicate Tailwind CSS classes.
 *
 * @param inputs - An array of class values (strings, objects, or arrays) to be combined and deduplicated.
 * @returns A string of combined and deduplicated class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an absolute URL by appending a given path to the application's base URL.
 *
 * @param path - The path to append to the base URL, defined in `NEXT_PUBLIC_APP_URL` environment variable.
 * @returns The absolute URL as a string.
 */
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
