import type { Metadata } from "next";
import { AreasPage } from "@/components/areas-page";
import { SiteShell } from "@/components/site-shell";
import { SERVICE_AREA } from "@/lib/coverage";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas we serve",
  description: `Bathroom remodels from Acadiana Bathrooms and Countertops. ${SERVICE_AREA}`,
  alternates: { canonical: pageCanonical("/areas") },
};

export default function Page() {
  return (
    <SiteShell sticky>
      <AreasPage />
    </SiteShell>
  );
}
