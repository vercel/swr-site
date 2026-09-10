# [SWR website](https://swr.vercel.app)

The official website for [SWR](https://github.com/vercel/swr).

The project uses [pnpm](https://pnpm.io), [Geistdocs](https://preview.geistdocs.com) and deploys via [Vercel](https://vercel.com). To develop it locally, clone this repository and run the following command to start the local dev server:

```bash
pnpm install
pnpm dev
```

And visit `localhost:3000` to preview your changes.

## Editable examples

The six browser examples use `devjar@next` (currently pinned to
`1.0.0-next.3`) and load `swr@latest` from esm.sh. `SWRExample` supplies
virtual source files to the shared `Playground`; `pages/index.jsx` is the
entry point. The `@sugar-high/react` editor provides syntax highlighting,
line numbers, and light/dark themes for JavaScript/JSX and CSS files.
The folder icon toggles the Sugar High FileTree, hidden by default.
When open, it sits above the editor on mobile.
Preview status shows loading or errors.
Authentication, pagination, mutations, and subscriptions use
simulated services so they can run without a backend.

Devjar handles its compiler assets and dependency resolution. No asset-copy
script, package patch, custom CDN resolver, or isolation headers are needed.

## Contributing

When making a change, or creating a new page, please make sure to edit all language files. You can simply copy the content of the edited English document (or the edited paragraph) and apply it to other language files. And then, volunteers are welcome to help with any untranslated sections.

## Contributors

- [https://github.com/vercel/swr-site/graphs/contributors](https://github.com/vercel/swr-site/graphs/contributors)
- Simplified Chinese translation done by Fang Lu ([@huzhengen](https://github.com/huzhengen))
- Spanish translation done by Markoz Peña ([@markozxuu](https://twitter.com/markozxuu))
- Japanese translation done by uttk ([@uttk](https://github.com/uttk)), Tomohiro SHIOYA ([@shioyang](https://github.com/shioyang))
- Korean translation done by SeulGi Choi ([@cs09g](https://github.com/cs09g))
- Russian translation done by Valentin Politov ([@valentinpolitov](https://github.com/valentinpolitov))
- Brazilian Portuguese translation done by Guilherme Sousa ([@guilherssousa](https://github.com/guilherssousa))
- French translation done by [@Olafr9500](https://github.com/Olafr9500)
