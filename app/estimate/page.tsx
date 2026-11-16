import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";
import { metadataTitle, pageMeta } from "@/lib/page-meta";
import { pageCanonical } from "@/lib/site";

const meta = pageMeta("/estimate");

export const metadata: Metadata = {
  title: metadataTitle(meta),
  description: meta.description,
  alternates: { canonical: pageCanonical("/estimate") },
};

export default function EstimatePage() {
  return (
    <SiteShell bleed formPage>
      <EstimateWizard />
    </SiteShell>
  );
}
