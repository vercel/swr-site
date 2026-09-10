import { Playground } from "./playground";
import { examples } from "@/lib/examples";

const styles = `body { margin: 0; padding: 16px; font: 14px/1.5 system-ui, sans-serif; color: #000; background: #fff; }
main { display: grid; justify-items: start; gap: 12px; }
h1, p, ul { margin: 0; }
h1 { font-size: 20px; line-height: 1.3; }
ul { padding-left: 20px; }
button, input { font: inherit; accent-color: #000; }
button { padding: 6px 12px; border: 0; background: #000; color: #fff; cursor: pointer; }
button:disabled { opacity: 0.5; cursor: default; }
input:not([type="checkbox"]) { padding: 6px 8px; border: 0; background: #f5f5f5; color: #000; min-width: 0; max-width: 100%; box-sizing: border-box; }
form { display: flex; flex-wrap: wrap; gap: 8px; }
label { display: inline-flex; align-items: center; gap: 6px; }
input[type="checkbox"] { margin: 0; }
[role="alert"] { font-weight: 600; }`;

export function SWRExample({ name = "basic" }: { name?: string }) {
  const files = { ...examples[name], "styles.css": styles };
  return <Playground key={name} files={files} title={`SWR ${name} example preview`} />;
}
