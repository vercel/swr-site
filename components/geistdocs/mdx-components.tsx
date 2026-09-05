import { createMdxComponents } from "@vercel/geistdocs/mdx";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Authors, { Author } from "@/components/custom/authors";
import { Bleed } from "@/components/custom/bleed";
import { Cache } from "@/components/custom/diagrams/cache";
import { Infinite } from "@/components/custom/diagrams/infinite";
import { Pagination } from "@/components/custom/diagrams/pagination";
import { Welcome } from "@/components/custom/diagrams/welcome";
import { SWRExample } from "@/components/custom/swr-example";

export const getMDXComponents = (components?: MDXComponents): MDXComponents =>
  createMdxComponents({
    // Site-specific components available in all MDX content
    Link,
    Bleed,
    Authors,
    Author,
    Welcome,
    Pagination,
    Infinite,
    Cache,
    SWRExample,

    // User components last to allow overwriting defaults
    ...components,
  });
