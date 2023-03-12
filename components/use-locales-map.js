import { useRouter } from "next/router";

/**
 * @typedef {"en-US"} DefaultLocale
 * @typedef {DefaultLocale | "zh-CN" | "es-ES" | "pt-BR" | "ja" | "ko" | "ru"} Locale
 * @typedef {{locale?: Locale | undefined; locales?: Locale[] | undefined; defaultLocale?: DefaultLocale | undefined}} TypedRouter
 * @typedef {Omit<import('next/router').NextRouter, "locale" | "locales" | "defaultLocale"> & TypedRouter} NextRouter
 * @template T
 * @type {(localesMap: Record<Locale, T>) => T}
 */
export default function useLocalesMap(localesMap) {
  /** @type {NextRouter} */
  const router = useRouter();
  const { locale, defaultLocale } = router;
  if (!localesMap) {
    throw new Error("Pass a locales map as argument to useLocalesMap");
  }

  if (!isObject(localesMap)) {
    throw new Error("Locales map must be an object");
  }

  if (!localesMap.hasOwnProperty(defaultLocale)) {
    throw new Error(
      `Locales map must contain default locale "${defaultLocale}"`
    );
  }

  if (
    localesMap.hasOwnProperty(locale) &&
    typeof localesMap[locale] !== typeof localesMap[defaultLocale]
  ) {
    throw new Error(
      `Invalid locales map: Shape of "${locale}" must be the same as "${defaultLocale}"`
    );
  }

  if (["string", "number", "symbol"].includes(typeof localesMap[defaultLocale])) {
    return localesMap[locale] || localesMap[defaultLocale];
  }

  return mergeDeep(localesMap[defaultLocale], localesMap[locale]);
}

/**
 * Simple object check.
 * @param {any} item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @template T
 * @param {Record<string, T>} target
 * @param {Record<string, T>} sources
 * @returns {Record<string, T>}
 */
export function mergeDeep(target, ...sources) {
  const targetClone = structuredClone(target)
  if (!sources.length) return targetClone;
  const source = sources.shift();

  if (isObject(targetClone) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!targetClone[key]) Object.assign(targetClone, { [key]: {} });
        mergeDeep(targetClone[key], source[key]);
      } else {
        Object.assign(targetClone, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(targetClone, ...sources);
}
