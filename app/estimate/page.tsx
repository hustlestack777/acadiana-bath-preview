import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Consult · Acadiana Bathrooms",
  description:
    "Free Consult with Acadiana Bathrooms and Countertops. Share the bathroom you have, and Justin will call you personally and give you an exact price once he sees the space.",

  alternates: { canonical: pageCanonical("/estimate") },
};

export default function EstimatePage() {
  return (
    <SiteShell sticky bleed>
      <EstimateWizard />
    </SiteShell>
  );
}
