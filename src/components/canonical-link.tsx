"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";

import { toAbsoluteUrl } from "@/lib/seo";

export function CanonicalLink() {
  const pathname = usePathname() || "/";

  return (
    <Head>
      <link rel="canonical" href={toAbsoluteUrl(pathname)} />
    </Head>
  );
}
