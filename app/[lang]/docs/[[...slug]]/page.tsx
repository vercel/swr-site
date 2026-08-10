import { MobileDocsBar } from "@vercel/geistdocs/mobile-docs-bar";
import { createDocsPage } from "@vercel/geistdocs/pages/docs";
import { getMDXComponents } from "@/components/geistdocs/mdx-components";
import { config } from "@/lib/geistdocs/config";
import { createSectionPageActions } from "@/lib/geistdocs/page-actions";
import { docsSource } from "@/lib/geistdocs/source";

const docsPage = createDocsPage({
  config,
  mdx: ({ link }) => getMDXComponents({ a: link }),
  openGraph: {
    images: true,
  },
  pageActions: createSectionPageActions("content/docs"),
  renderTop: ({ data }) => <MobileDocsBar toc={data.toc} />,
  source: docsSource,
  tableOfContentPopover: {
    enabled: false,
  },
});

export default docsPage.Page;
export const generateStaticParams = docsPage.generateStaticParams;
export const generateMetadata = docsPage.generateMetadata;
