import { redirect } from "next/navigation";
import { config } from "@/lib/geistdocs/config";

/**
 * The SWR marketing homepage lives at vercel.com/oss/swr, so the root of
 * this site sends visitors straight to the first docs page.
 */
const Page = async ({ params }: PageProps<"/[lang]">) => {
  const { lang } = await params;

  redirect(
    lang === config.defaultLanguage
      ? "/docs/getting-started"
      : `/${lang}/docs/getting-started`
  );
};

export default Page;
