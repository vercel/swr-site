import { defineConfig } from "@vercel/geistdocs/config";
import {
  agent,
  basePath,
  content,
  github,
  Logo,
  logoHref,
  nav,
  prompt,
  siteId,
  suggestions,
  title,
  translations,
} from "@/geistdocs";

export const config = defineConfig({
  title,
  agent,
  defaultLanguage: "en",
  logo: <Logo />,
  logoHref,
  github,
  nav,
  basePath,
  siteId,
  translations,
  content,
  ai: {
    prompt,
    suggestions,
  },
});
