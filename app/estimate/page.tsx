import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Quote",
  description:
    "Get a free quote from Acadiana Bathrooms and Countertops. Tell us about your project and the best time to reach you. We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.",

  alternates: { canonical: pageCanonical("/estimate") },
};

export default function EstimatePage() {
  return (
    <SiteShell bleed formPage>
      <EstimateWizard />
    </SiteShell>
  );
}
