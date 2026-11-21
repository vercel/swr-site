"use client";

import { Analytics } from "@vercel/analytics/next";
import { GeistdocsProvider as PackageProvider } from "@vercel/geistdocs/layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";
import { type ComponentProps, useEffect, useRef } from "react";
import { config } from "@/lib/geistdocs/config";

type GeistdocsProviderProps = Omit<
  ComponentProps<typeof PackageProvider>,
  "config"
> & {
  lang?: string;
};

export const GeistdocsProvider = ({
  lang,
  ...props
}: GeistdocsProviderProps) => {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

    HTMLElement.prototype.scrollIntoView = function (
      arg?: boolean | ScrollIntoViewOptions
    ) {
      const tocScrollContainer = this.closest<HTMLElement>(
        ".geistdocs-toc-scroll"
      );

      if (tocScrollContainer) {
        const containerRect = tocScrollContainer.getBoundingClientRect();
        const itemRect = this.getBoundingClientRect();

        if (itemRect.top < containerRect.top) {
          tocScrollContainer.scrollTop += itemRect.top - containerRect.top;
        } else if (itemRect.bottom > containerRect.bottom) {
          tocScrollContainer.scrollTop +=
            itemRect.bottom - containerRect.bottom;
        }
        return;
      }

      return originalScrollIntoView.call(this, arg);
    };

    return () => {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    };
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }
    previousPathname.current = pathname;

    if (window.location.hash) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let lastScrollY = -1;
    let stagnantFrames = 0;
    const startTime = performance.now();

    const cancelOnUserInput = () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };

    window.addEventListener("wheel", cancelOnUserInput, { passive: true });
    window.addEventListener("touchstart", cancelOnUserInput, { passive: true });
    window.addEventListener("keydown", cancelOnUserInput, { passive: true });
    window.addEventListener("pointerdown", cancelOnUserInput, {
      passive: true,
    });

    const ensureSmoothScrollToTop = () => {
      if (cancelled || window.location.hash) {
        return;
      }

      const currentY = window.scrollY;
      if (currentY <= 1 || performance.now() - startTime > 1200) {
        return;
      }

      if (lastScrollY === -1) {
        lastScrollY = currentY;
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (Math.abs(currentY - lastScrollY) < 0.5) {
        stagnantFrames += 1;
        if (stagnantFrames >= 3) {
          stagnantFrames = 0;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        stagnantFrames = 0;
        lastScrollY = currentY;
      }

      frameId = requestAnimationFrame(ensureSmoothScrollToTop);
    };

    frameId = requestAnimationFrame(ensureSmoothScrollToTop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("wheel", cancelOnUserInput);
      window.removeEventListener("touchstart", cancelOnUserInput);
      window.removeEventListener("keydown", cancelOnUserInput);
      window.removeEventListener("pointerdown", cancelOnUserInput);
    };
  }, [pathname]);

  return (
    <>
      <PackageProvider config={config} lang={lang} {...props} />
      <Analytics />
      <SpeedInsights />
    </>
  );
};
