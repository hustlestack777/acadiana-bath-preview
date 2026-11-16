import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { WindowsTool } from "@/components/windows/windows-tool";
import { windowServiceJsonLd } from "@/lib/schema";
import { metadataTitle, pageMeta } from "@/lib/page-meta";
import { pageCanonical } from "@/lib/site";

const meta = pageMeta("/windows");

export const metadata: Metadata = {
  title: metadataTitle(meta),
  description: meta.description,
  alternates: { canonical: pageCanonical("/windows") },
};

export default function WindowsPage() {
  return (
    <SiteShell>
      <JsonLd data={windowServiceJsonLd()} />
      <main id="content" tabIndex={-1}>
        <WindowsTool />
      </main>
    </SiteShell>
  );
}
