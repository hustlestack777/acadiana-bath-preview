import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Project review",
  description:
    "Free Consult with Acadiana Bathrooms and Countertops. Share the bathroom you have. The request is saved for follow-up. It is not a final quote.",
};

export default function EstimatePage() {
  return (
    <SiteShell sticky bleed>
      <EstimateWizard />
    </SiteShell>
  );
}
