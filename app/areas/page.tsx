import type { Metadata } from "next";
import { AreasPage } from "@/components/areas-page";
import { SiteShell } from "@/components/site-shell";
import { metadataTitle, pageMeta } from "@/lib/page-meta";
import { pageCanonical } from "@/lib/site";

const meta = pageMeta("/areas");

export const metadata: Metadata = {
  title: metadataTitle(meta),
  description: meta.description,
  alternates: { canonical: pageCanonical("/areas") },
};

export default function Page() {
  return (
    <SiteShell sticky>
      <AreasPage />
    </SiteShell>
  );
}
