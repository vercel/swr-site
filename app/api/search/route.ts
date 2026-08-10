import { createSearchRoute } from "@vercel/geistdocs/routes/search";
import { config } from "@/lib/geistdocs/config";
import { sources } from "@/lib/geistdocs/source";

/**
 * The search route derives the Orama stemmer language from each
 * translation's displayName, so native display names ("Français",
 * "日本語") are not valid. Map each locale to an Orama-supported
 * language without changing the display names used in the UI.
 *
 * - cn is special-cased with a Mandarin tokenizer by the package
 *   (displayName is ignored for it).
 * - ja and ko have no Orama stemmer, so they fall back to english.
 */
const oramaLanguages: Record<string, string> = {
  en: "english",
  es: "spanish",
  fr: "french",
  ja: "english",
  ko: "english",
  pt: "portuguese",
  ru: "russian",
  cn: "english",
};

const searchConfig = {
  defaultLanguage: config.defaultLanguage,
  translations: Object.fromEntries(
    Object.entries(config.translations ?? {}).map(([locale, translation]) => [
      locale,
      {
        ...translation,
        displayName: oramaLanguages[locale] ?? "english",
      },
    ])
  ),
};

export const GET = createSearchRoute({ config: searchConfig, sources });
