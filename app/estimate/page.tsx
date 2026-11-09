import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Project review",
  description:
    "Show us your space and tell us what you have in mind. Free Consult with Acadiana Bathrooms and Countertops. Call 337-522-0023.",
};

export default function EstimatePage() {
  return (
    <SiteShell>
      <EstimateWizard />
    </SiteShell>
  );
}
