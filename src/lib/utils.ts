import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * True when a dated event has already happened. Undated items are never "past".
 * Lives outside the components so the clock read is not treated as render-time impurity.
 */
export function isPastEvent(eventDate: Date | null): boolean {
  return eventDate ? eventDate.getTime() < Date.now() : false;
}
