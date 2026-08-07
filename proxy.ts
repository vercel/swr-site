import { createProxy } from "@vercel/geistdocs/proxy";
import { config as geistdocsConfig } from "@/lib/geistdocs/config";
import { trackMdRequest } from "@/lib/md-tracking";

const proxy = createProxy({
  config: geistdocsConfig,
  trackMarkdownRequest: trackMdRequest,
});

export const config = {
  matcher: [
    // Excludes API routes, Next internals, and public/ asset directories
    // (img, video, favicon) — otherwise the i18n middleware rewrites asset
    // paths to /<lang>/... and they 404 instead of serving from public/.
    "/((?!api(?:/|$)|_next/static|_next/image|favicon\\.ico|favicon\\.development\\.ico|favicon\\.preview\\.ico|sitemap\\.xml|robots\\.txt|img/|video/|favicon/).*)",
  ],
};

export default proxy;
