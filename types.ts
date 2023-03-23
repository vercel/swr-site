export type DefaultLocale = "en-US";
export type Locale =
  | DefaultLocale
  | "zh-CN"
  | "es-ES"
  | "pt-BR"
  | "ja"
  | "ko"
  | "ru";
export type LocalesMap<T extends unknown = string> = Readonly<
  Record<DefaultLocale, T> &
    Partial<Record<Exclude<Locale, DefaultLocale>, Partial<T>>>
>;
export type RouterLocales = {
  locale?: Locale | undefined;
  locales?: Locale[] | undefined;
  defaultLocale?: DefaultLocale | undefined;
};
export type TypedNextRouter = Omit<
  import("next/router").NextRouter,
  keyof RouterLocales
> &
  RouterLocales;
