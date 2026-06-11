import { createDocsMarkdownRoute } from "@vercel/geistdocs/routes/llms";
import { sources } from "@/lib/geistdocs/source";

export const { GET, generateStaticParams, revalidate } =
  createDocsMarkdownRoute({ sources });
