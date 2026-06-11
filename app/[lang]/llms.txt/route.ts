import { createLlmsRoute } from "@vercel/geistdocs/routes/llms";
import { sources } from "@/lib/geistdocs/source";

export const { GET, revalidate } = createLlmsRoute({ sources });
