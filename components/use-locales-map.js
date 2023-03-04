import { useRouter } from "next/router";

/**
 * @typedef {"en-US"} DefaultLocale
 * @typedef {DefaultLocale | "zh-CN" | "es-ES" | "pt-BR" | "ja" | "ko" | "ru"} Locale
 * @typedef {{locale?: Locale | undefined; locales?: Locale[] | undefined; defaultLocale?: DefaultLocale | undefined}} TypedRouter
 * @typedef {Omit<import('next/router').NextRouter, "locale" | "locales" | "defaultLocale"> & TypedRouter} NextRouter
 */

/**
 * @template T
 * @type {(localesMap: Record<Locale, T>) => T}
 */
export default function useLocalesMap(localesMap) {
  /** @type {NextRouter} */
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  if (!localesMap) {
    throw new Error("Pass a locales map as argument to useLocalesMap hook.");
  }

  if (typeof localesMap !== "object") {
    localesMapError(
      localesMap,
      `Locales map must be an object, but you passed ${typeof localesMap}.`
    );
  }

  if (Array.isArray(localesMap)) {
    localesMapError(
      localesMap,
      "Locales map must be an object, but you passed an array."
    );
  }

  if (!localesMap.hasOwnProperty(defaultLocale)) {
    localesMapError(
      localesMap,
      `Locales map must contain default locale "${defaultLocale}"`
    );
  }

  for (const key in localesMap) {
    if (!locales.includes(key)) {
      const list = locales.map((l) => `"${l}"`).join(", ");

      localesMapError(
        localesMap,
        `"${key}" is not a valid locale.`,
        `Available locales are defined in "next.config.js": ${list}.`
      );
    }

    if (typeof localesMap[key] !== typeof localesMap[defaultLocale]) {
      localesMapError(
        localesMap,
        `Shape of "${key}" must be the same as "${defaultLocale}"`
      );
    }
  }

  if (
    ["string", "number", "symbol"].includes(typeof localesMap[defaultLocale])
  ) {
    return localesMap[locale] || localesMap[defaultLocale];
  }

  const target = JSON.parse(JSON.stringify(localesMap[defaultLocale]));
  return mergeDeep(target, localesMap[locale]);
}

/**
 * Simple object check.
 * @param {any} item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @template T
 * @param {Record<string, T>} target
 * @param {Record<string, T>} sources
 * @returns {Record<string, T>}
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * Throw an error with a formatted message.
 * @template T
 * @param {Record<Locale, T>} localesMap
 * @param  {string[]} args
 */
export function localesMapError(localesMap, ...args) {
  throw new Error(
    ["Invalid locales map", JSON.stringify(localesMap, null, 2), ...args].join(
      "\n"
    )
  );
}
