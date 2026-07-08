import { useEffect } from "react";
import { useSession } from "./session-context";
import { isRTL } from "@/lib/language";

/**
 * Keeps the <html lang> and dir attributes in sync with the selected language.
 * Runs client-side only; SSR default is set in RootShell.
 */
export function HtmlLangSync() {
  const { language } = useSession();
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? "rtl" : "ltr";
  }, [language]);
  return null;
}
