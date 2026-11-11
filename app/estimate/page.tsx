import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Quote",
  description:
    "Get a free quote from Acadiana Bathrooms and Countertops. Tell us about your project and the best time to reach you. Justin will call to discuss your project, then set a time to take measurements, walk you through your design options and give you your exact price on the spot.",

  alternates: { canonical: pageCanonical("/estimate") },
};

export default function EstimatePage() {
  return (
    <SiteShell sticky bleed>
      <EstimateWizard />
    </SiteShell>
  );
}
