import type {
  GeistdocsAgentReadinessConfig,
  GeistdocsConfig,
} from "@vercel/geistdocs/config";

export const Logo = () => (
  <div className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-75 ltr:mr-auto rtl:ml-auto">
    <svg
      width="51"
      height="12"
      viewBox="0 0 291 69"
      fill="none"
      className="block h-3 w-auto shrink-0"
      aria-hidden="true"
    >
      <path
        d="M0 36.53c.07 17.6 14.4 32.01 32.01 32.01a32.05 32.05 0 0032.01-32V32a13.2 13.2 0 0123.4-8.31h20.7A32.07 32.07 0 0077.2 0a32.05 32.05 0 00-32 32.01v4.52A13.2 13.2 0 0132 49.71a13.2 13.2 0 01-13.18-13.18 3.77 3.77 0 00-3.77-3.77H3.76A3.77 3.77 0 000 36.53zM122.49 68.54a32.14 32.14 0 01-30.89-23.7h20.67a13.16 13.16 0 0023.4-8.3V32A32.05 32.05 0 01167.68 0c17.43 0 31.64 14 32 31.33l.1 5.2a13.2 13.2 0 0023.4 8.31h20.7a32.07 32.07 0 01-30.91 23.7c-17.61 0-31.94-14.42-32.01-32l-.1-4.7v-.2a13.2 13.2 0 00-13.18-12.81 13.2 13.2 0 00-13.18 13.18v4.52a32.05 32.05 0 01-32.01 32.01zM247.94 23.7a13.16 13.16 0 0123.4 8.31 3.77 3.77 0 003.77 3.77h11.3a3.77 3.77 0 003.76-3.77A32.05 32.05 0 00258.16 0a32.07 32.07 0 00-30.92 23.7h20.7z"
        fill="currentColor"
      />
    </svg>
    <span className="hidden select-none text-sm font-bold leading-none tracking-tight md:inline">
      SWR
    </span>
  </div>
);

/**
 * The site root 307s to the vercel.com/oss/swr lander, so the navbar
 * wordmark deep-links into the docs instead of bouncing visitors off the
 * site they are already on. Locale prefixes are applied automatically.
 */
export const logoHref = "/docs/getting-started";

/** The SWR library repository (used for the GitHub button). */
export const github = {
  owner: "vercel",
  repo: "swr",
};

/** The repository containing this docs site (used for "Edit on GitHub" links). */
export const docsRepo = {
  owner: "vercel",
  repo: "swr-site",
  branch: "main",
};

export const nav: NonNullable<GeistdocsConfig["nav"]> = [
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Examples",
    href: "/examples",
  },
];

export const content: NonNullable<GeistdocsConfig["content"]> = [
  { id: "docs", label: "Docs", dir: "content/docs", route: "/docs" },
  { id: "blog", label: "Blog", dir: "content/blog", route: "/blog" },
  {
    id: "examples",
    label: "Examples",
    dir: "content/examples",
    route: "/examples",
  },
];

export const suggestions = [
  "What is SWR?",
  "How does SWR work?",
  "How do I fetch data?",
  "How do I handle errors?",
];

export const title = "SWR Documentation";

export const prompt =
  "You are a helpful assistant specializing in answering questions about SWR, a library for data fetching in React.";

export const agent = {
  product: {
    name: "SWR",
    description:
      "SWR is a React Hooks library for data fetching. The name comes from stale-while-revalidate: it first returns data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data.",
    category: "Data fetching",
    audience: ["React developers", "Next.js developers"],
    useCases: [
      "Fetch, cache, and revalidate remote data in React applications",
      "Build fast, reactive UIs with automatic revalidation",
      "Handle pagination, mutations, and optimistic UI updates",
    ],
  },
  links: [
    {
      label: "SWR source",
      href: `https://github.com/${github.owner}/${github.repo}`,
      description: "Source repository for the SWR library",
    },
    {
      label: "SWR docs source",
      href: `https://github.com/${docsRepo.owner}/${docsRepo.repo}`,
      description: "Source repository for this documentation site",
    },
  ],
} satisfies GeistdocsAgentReadinessConfig;

export const translations = {
  en: {
    displayName: "English",
    slug: "english",
  },
  es: {
    displayName: "Español",
    slug: "spanish",
  },
  fr: {
    displayName: "Français",
    slug: "french",
  },
  ja: {
    displayName: "日本語",
    slug: "japanese",
  },
  ko: {
    displayName: "한국어",
    slug: "korean",
  },
  pt: {
    displayName: "Português",
    slug: "portuguese",
  },
  ru: {
    displayName: "Русский",
    slug: "russian",
  },
  cn: {
    displayName: "简体中文",
    slug: "chinese",
  },
};

export const basePath: string | undefined = undefined;

/**
 * Unique identifier for this site, used in markdown request tracking analytics.
 */
export const siteId: string | undefined = "swr";
