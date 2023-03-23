/** @type {import('nextra').NextraConfig} */
const nextraConfig = {
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  flexsearch: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en-US", "zh-CN", "es-ES", "pt-BR", "ja", "ko", "ru"],
    defaultLocale: "en-US",
  },
  redirects: () => {
    return [
      {
        source: "/docs",
        destination: "/docs/getting-started",
        statusCode: 301,
      },
      {
        source: "/advanced/performance",
        destination: "/docs/advanced/performance",
        statusCode: 301,
      },
      {
        source: "/advanced/cache",
        destination: "/docs/advanced/cache",
        statusCode: 301,
      },
      {
        source: "/docs/cache",
        destination: "/docs/advanced/cache",
        statusCode: 301,
      },
      {
        source: "/docs/options",
        destination: "/docs/api",
        statusCode: 301,
      },
      {
        source: "/change-log",
        destination: "/docs/change-log",
        statusCode: 301,
      },
      {
        source: "/blog/swr-1",
        destination: "/blog/swr-v1",
        statusCode: 301,
      },
      {
        source: "/docs",
        destination: "/docs/getting-started",
        statusCode: 302,
      },
      {
        source: "/examples",
        destination: "/examples/basic",
        statusCode: 302,
      },
    ];
  },
  reactStrictMode: true,
};

/** @type {import('nextra').Nextra} */
const nextra = require("nextra");

const withNextra = nextra(nextraConfig);

module.exports = withNextra(nextConfig);
