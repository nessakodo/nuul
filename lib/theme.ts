export type ThemeMode = "warm" | "dreamy";

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme === "dreamy" ? "dreamy" : "warm");
}

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") return "warm";
  const stored = window.localStorage.getItem("nuul-theme");
  return stored === "dreamy" ? "dreamy" : "warm";
}

export function saveTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("nuul-theme", theme);
}
