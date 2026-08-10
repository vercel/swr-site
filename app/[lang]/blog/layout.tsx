import { DocsLayout } from "@/components/geistdocs/docs-layout";
import { blogSource } from "@/lib/geistdocs/source";

const Layout = async ({ children, params }: LayoutProps<"/[lang]/blog">) => {
  const { lang } = await params;

  return <DocsLayout tree={blogSource.source.pageTree[lang]}>{children}</DocsLayout>;
};

export default Layout;
