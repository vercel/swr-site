import { useRouter } from "next/router";
import { LocalesMap, TypedNextRouter } from "../types";

export default function useLocalesMap<T>(localesMap: LocalesMap<T>): T {
  const { locale, defaultLocale } = useRouter() as TypedNextRouter;

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

  if (
    ["string", "number", "symbol"].includes(typeof localesMap[defaultLocale])
  ) {
    return (localesMap[locale] as T) ?? localesMap[defaultLocale];
  }

  const target: T = JSON.parse(JSON.stringify(localesMap[defaultLocale]));
  return mergeDeep(target, localesMap[locale]);
}

export function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep<T extends Record<string, any> = {}>(
  target: T,
  ...sources: Partial<T>[]
): T {
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
