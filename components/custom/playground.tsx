"use client";

import { DevJar } from "devjar";
import { useState } from "react";
import styles from "./playground.module.css";

const dependencies = {
  react: "19.2.3",
  "react-dom": "19.2.3",
  swr: "latest",
};

export function Playground({
  files: initialFiles,
  title,
}: {
  files: Record<string, string>;
  title: string;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("pages/index.jsx");
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<unknown>();

  return (
    <div className={`${styles.playground} not-prose`}>
      <div className={styles.toolbar}>
        <label>
          File{" "}
          <select value={activeFile} onChange={(event) => setActiveFile(event.target.value)}>
            {Object.keys(files).map((file) => <option key={file}>{file}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => {
          setFiles(initialFiles);
          setError(undefined);
          setRevision((value) => value + 1);
        }}>Reset example</button>
      </div>
      <div className={styles.panels}>
        <textarea
          aria-label={`Edit ${activeFile}`}
          className={styles.editor}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={files[activeFile]}
          onChange={(event) => setFiles({ ...files, [activeFile]: event.target.value })}
        />
        <div className={styles.preview}>
          <DevJar
            key={revision}
            files={files}
            dependencies={dependencies}
            tailwind={false}
            title={title}
            onError={setError}
          />
          {error != null && <pre role="alert" className={styles.error}>{String(error)}</pre>}
        </div>
      </div>
    </div>
  );
}
