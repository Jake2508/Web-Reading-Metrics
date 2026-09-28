import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

/** For one-off imperative calls (e.g. scrollIntoView) outside React state. */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia(QUERY).matches ? "auto" : "smooth";
}
