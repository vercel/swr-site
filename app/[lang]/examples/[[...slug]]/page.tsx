import { MobileDocsBar } from "@vercel/geistdocs/mobile-docs-bar";
import { createDocsPage } from "@vercel/geistdocs/pages/docs";
import { getMDXComponents } from "@/components/geistdocs/mdx-components";
import { config } from "@/lib/geistdocs/config";
import { createDisabledPageActions } from "@/lib/geistdocs/page-actions";
import { examplesSource } from "@/lib/geistdocs/source";

const examplesPage = createDocsPage({
  config,
  mdx: ({ link }) => getMDXComponents({ a: link }),
  openGraph: {
    images: true,
  },
  pageActions: createDisabledPageActions(),
  renderTop: ({ data }) => <MobileDocsBar toc={data.toc} />,
  source: examplesSource,
  tableOfContentPopover: {
    enabled: false,
  },
});

export default examplesPage.Page;
export const generateStaticParams = examplesPage.generateStaticParams;
export const generateMetadata = examplesPage.generateMetadata;
