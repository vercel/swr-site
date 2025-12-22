import { SiGithub } from "@icons-pack/react-simple-icons";
import { githubSite } from "@/geistdocs";

type EditSourceProps = {
  type: 'docs' | 'blog' | 'examples';
  path: string | undefined;
};

export const EditSource = ({ type, path }: EditSourceProps) => {
  let url: string | undefined;

  if (githubSite.owner && githubSite.repo && path) {
    url = `https://github.com/${githubSite.owner}/${githubSite.repo}/edit/main/content/${type}/${path}`;
  }

  if (!url) {
    return null;
  }

  return (
    <a
      className="flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <SiGithub className="size-3.5" />
      <span>Edit this page on GitHub</span>
    </a>
  );
};
