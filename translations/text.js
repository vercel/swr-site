/**
 * @typedef {"en-US"} DefaultLocale
 * @typedef {DefaultLocale | "zh-CN" | "es-ES" | "pt-BR" | "ja" | "ko" | "ru"} Locale
 */

/** @type {Readonly<Record<Locale, string>>} */
export const languageMap = {
  "en-US": "English",
  "es-ES": "Español",
  "pt-BR": "Português Brasileiro",
  "zh-CN": "简体中文",
  ja: "日本語",
  ko: "한국어",
  ru: "Русский",
};

/** @type {Readonly<Record<Locale, string>>} */
export const titleMap = {
  "en-US": "React Hooks for Data Fetching",
  "es-ES": "Biblioteca React Hooks para la obtención de datos",
  "pt-BR": "React Hooks para Data Fetching",
  "zh-CN": "用于数据请求的 React Hooks 库",
  ja: "データ取得のための React Hooks ライブラリ",
  ko: "데이터 가져오기를 위한 React Hooks",
  ru: "React хуки для выборки данных",
};

/** @type {Readonly<Record<Locale, {lightweight:string;realtime?:string;suspense?:string;pagination?:string;backendAgnostic?:string;renderingStrategies?:string;typescript?:string;remoteLocal?:string;}>>} */
export const featuresMap = {
  "en-US": {
    lightweight: "Lightweight",
    realtime: "Realtime",
    suspense: "Suspense",
    pagination: "Pagination",
    backendAgnostic: "Backend Agnostic",
    renderingStrategies: "SSR / SSG Ready",
    typescript: "TypeScript Ready",
    remoteLocal: "Remote + Local",
  },
  "pt-BR": {
    lightweight: "Leve",
    realtime: "Tempo-real",
    suspense: "Suspense",
    pagination: "Paginação",
    backendAgnostic: "Backend Agnóstico",
    renderingStrategies: "Pronto para SSR / SSG",
    typescript: "Pronto para TypeScript",
    remoteLocal: "Remoto + Local",
  },
  ru: {
    lightweight: "Лёгкий",
    realtime: "В реальном времени",
    suspense: "Задержка",
    pagination: "Пагинация",
    backendAgnostic: "Бэкэнд-независимый",
    renderingStrategies: "SSR / SSG",
    typescript: "TypeScript",
    remoteLocal: "Удалённо + Локально",
  },
};

/** @type {Readonly<Record<Locale, string>>} */
export const headDescriptionMap = {
  "en-US":
    "SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.",
    "pt-BR": "SWR é uma biblioteca React Hooks para data fetching. SWR primeiro retorna os dados do cache (stale), então envia a requisição de busca (revalidate), e finalmente vem com os dados atualizados novamente.",
  ru: "SWR — это библиотека React хуков для получения данных. SWR сначала возвращает данные из кеша (устаревшие), затем отправляет запрос на выборку (ревалидация) и, наконец, снова получает актуальные данные.",
};

/** @type {Readonly<Record<Locale, string>>} */
export const feedbackLinkMap = {
  "en-US": "Question? Give us feedback →",
  "es-ES": "¿Dudas? Danos tu feedback →",
  "pt-BR": "Dúvidas? Nos dê feedback →",
  "zh-CN": "有疑问？给我们反馈 →",
  ko: "질문이 있으신가요? 피드백을 남겨주세요 →",
  ru: "Вопросы? Оставьте нам отзыв →",
};

/** @type {Readonly<Record<Locale, string>>} */
export const editTextMap = {
  "en-US": "Edit this page on GitHub →",
  "es-ES": "Edite esta página en GitHub →",
  "pt-BR": "Edite essa página no GitHub →",
  "zh-CN": "在 GitHub 上编辑本页 →",
  ja: "Github で編集する →",
  ko: "Github에서 이 페이지 편집하기 →",
  ru: "Редактировать эту страницу на GitHub →",
};

/** @type {Readonly<Record<Locale, { utmSource: string; text: string; suffix?: string | undefined }>>} */
export const footerTextMap = {
  "en-US": { utmSource: "swr", text: "Powered by" },
  "es-ES": { utmSource: "swr_es-es", text: "Desarrollado por" },
  "pt-BR": { utmSource: "swr_pt-br", text: "Desenvolvido por" },
  "zh-CN": { utmSource: "swr_zh-cn", text: "由", suffix: "驱动" },
  ja: { utmSource: "swr_ja", text: "提供" },
  ko: { utmSource: "swr_ko", text: "Powered by" },
  ru: { utmSource: "swr_ru", text: "Работает на" },
};

/** @type {Readonly<Record<Locale, string>>} */
export const tableOfContentsTitleMap = {
  "en-US": "On This Page",
  "es-ES": "En esta página",
  "pt-BR": "Nessa página",
  ru: "На этой странице",
};

/** @type {Readonly<Record<Locale, string>>} */
export const searchPlaceholderMap = {
  "en-US": "Search documentation...",
  "es-ES": "Buscar documento...",
  "pt-BR": "Buscar documentação...",
  ko: "문서 검색...",
  ru: "Искать в документации...",
};

/** @type {Readonly<Record<Locale, string>>} */
export const gitTimestampMap = {
  "en-US": "Last updated on",
  ru: "Последнее обновление",
};
