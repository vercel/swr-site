import { MobileDocsBar } from "@vercel/geistdocs/mobile-docs-bar";
import { createDocsPage } from "@vercel/geistdocs/pages/docs";
import { getMDXComponents } from "@/components/geistdocs/mdx-components";
import { config } from "@/lib/geistdocs/config";
import { createSectionPageActions } from "@/lib/geistdocs/page-actions";
import { blogSource } from "@/lib/geistdocs/source";

const blogPage = createDocsPage({
  config,
  mdx: ({ link }) => getMDXComponents({ a: link }),
  openGraph: {
    images: true,
  },
  pageActions: createSectionPageActions("content/blog"),
  renderTop: ({ data }) => <MobileDocsBar toc={data.toc} />,
  source: blogSource,
  tableOfContentPopover: {
    enabled: false,
  },
});

export default blogPage.Page;
export const generateStaticParams = blogPage.generateStaticParams;
export const generateMetadata = blogPage.generateMetadata;
