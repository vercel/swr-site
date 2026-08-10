import { createSource } from "@vercel/geistdocs/source";
import { blog, docs, examples } from "@/.source/server";
import { config } from "./config";

export const docsSource = createSource({
  docs,
  config,
  id: "docs",
  label: "Docs",
  baseUrl: "/docs",
});

export const blogSource = createSource({
  docs: blog,
  config,
  id: "blog",
  label: "Blog",
  baseUrl: "/blog",
});

export const examplesSource = createSource({
  docs: examples,
  config,
  id: "examples",
  label: "Examples",
  baseUrl: "/examples",
});

export const sources = [docsSource, blogSource, examplesSource];

export const source = docsSource.source;
export const getPageImage = docsSource.getPageImage;
