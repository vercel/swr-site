import { Playground } from "./playground";
import { examples } from "@/lib/examples";

const files = {
  "pages/index.jsx": `import useSWR from 'swr'
import '../styles.css'

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Could not load data')
  return res.json()
})

export default function App() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'https://api.github.com/repos/vercel/swr', fetcher
  )

  if (isLoading) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>

  return (
    <main>
      <h1>{data.full_name}</h1>
      <p>{data.description}</p>
      <p>⭐ {data.stargazers_count} stars</p>
      <button onClick={() => mutate()} disabled={isValidating}>
        {isValidating ? 'Refreshing…' : 'Refresh'}
      </button>
      <p>Switch tabs and come back to revalidate automatically.</p>
    </main>
  )
}`,
  "styles.css": `body { margin: 0; padding: 24px; font: 15px/1.6 system-ui, sans-serif; color: #171717; }
h1 { font-size: 24px; line-height: 1.3; }
button, input { font: inherit; padding: 6px 12px; }
button { cursor: pointer; }
button:disabled { cursor: default; opacity: 0.6; }
input { max-width: 100%; box-sizing: border-box; }
form { display: flex; flex-wrap: wrap; gap: 8px; }
li { margin: 8px 0; }
[role="alert"] { color: #b91c1c; }`,
};

export function SWRExample({ name = "basic" }: { name?: string }) {
  const source = name === "basic" ? files : { ...examples[name], "styles.css": files["styles.css"] };
  return <Playground key={name} files={source} title={`SWR ${name} example preview`} />;
}
