import type { Language } from "@/types";

export const LANGUAGES: Readonly<Record<Language, string>> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
};

/** Rough heuristic language detector — no external deps. */
export function detectLanguage(text: string): Language {
  const t = text.trim();
  if (!t) return "en";
  if (/[\u0600-\u06FF]/.test(t)) return "ar";
  const lower = t.toLowerCase();
  if (/\b(donde|gracias|hola|puedo|baño|entrada|salida)\b/.test(lower)) return "es";
  if (/\b(où|merci|bonjour|toilettes|sortie|entrée)\b/.test(lower)) return "fr";
  return "en";
}

export function isRTL(lang: Language): boolean {
  return lang === "ar";
}
