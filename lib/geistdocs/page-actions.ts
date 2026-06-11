import { createPageActions } from "@vercel/geistdocs/pages/docs";
import { docsRepo } from "@/geistdocs";
import { config } from "./config";

/**
 * Page actions for a content section.
 *
 * The footer GitHub button (config.github) points at the SWR library repo,
 * while "Edit on GitHub" links must point at this docs repo with the
 * section's content directory.
 */
export const createSectionPageActions = (dir: string) =>
  createPageActions({
    config: {
      ...config,
      github: {
        ...docsRepo,
        editPath: `${dir}/{path}`,
      },
    },
  });
