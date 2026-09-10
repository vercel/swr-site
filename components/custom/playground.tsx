"use client";

import { DevJar, type PreviewStatus } from "devjar";
import { Editor, FileTree } from "@sugar-high/react";
import { vercel } from "@sugar-high/react/themes";
import { useState } from "react";
import styles from "./playground.module.css";

const dependencies = { react: "19.2.3", "react-dom": "19.2.3", swr: "latest" };

export function Playground({ files: initialFiles, title }: {
  files: Record<string, string>;
  title: string;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("pages/index.jsx");
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<unknown>();
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const busy = status === "idle" || status === "compiling" || status === "loading";

  function reset() {
    setFiles(initialFiles);
    setError(undefined);
    setStatus("idle");
    setRevision((value) => value + 1);
  }

  return (
    <div className={`${styles.playground} not-prose`}>
      <div className={styles.toolbar}>
        <span role="status">{busy ? "Loading preview…" : status === "failed" ? "Preview error" : "Preview ready"}</span>
        <button type="button" onClick={reset}>Reset example</button>
      </div>
      <div className={styles.panels}>
        <div className={styles.workspace}>
          <FileTree
            className={styles.files}
            aria-label="Example files"
            paths={Object.keys(files)}
            activeFile={activeFile}
            onActiveFileChange={setActiveFile}
            theme={vercel}
          />
          <Editor
            key={`${activeFile}:${revision}`}
            className={styles.editor}
            controls={false}
            lineNumbers
            wrapLongLines={false}
            extension={activeFile.split(".").pop()}
            theme={vercel}
            fontSize="var(--playground-font-size, 13px)"
            fontFamily="var(--font-geist-mono, monospace)"
            padding="16px"
            textareaProps={{ "aria-label": `Edit ${activeFile}`, spellCheck: false, autoCapitalize: "off", autoCorrect: "off" }}
            value={files[activeFile]}
            onChange={(code) => setFiles((current) => ({ ...current, [activeFile]: code }))}
          />
        </div>
        <div className={styles.preview} aria-busy={busy}>
          <DevJar key={revision} files={files} dependencies={dependencies} tailwind={false}
            title={title} onError={setError} onStatusChange={setStatus} />
          {error != null && <pre role="alert" className={styles.error}>{String(error)}</pre>}
        </div>
      </div>
    </div>
  );
}
