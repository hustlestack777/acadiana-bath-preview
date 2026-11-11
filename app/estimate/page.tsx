import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Consult · Acadiana Bathrooms",
  description:
    "Free Consult with Acadiana Bathrooms and Countertops. Share the bathroom you have. The request is saved for follow-up. It is not a final quote.",

  alternates: { canonical: pageCanonical("/estimate") },
};

export default function EstimatePage() {
  return (
    <SiteShell sticky bleed>
      <EstimateWizard />
    </SiteShell>
  );
}
