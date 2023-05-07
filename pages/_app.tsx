import "../styles.css";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

export default function Nextra({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
