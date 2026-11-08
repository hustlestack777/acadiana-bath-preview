import type { Metadata } from "next";
import { EstimateWizard } from "@/components/estimate-wizard";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Project review",
  description:
    "Show us your space and tell us what you have in mind. Placeholder range only. Nothing is submitted.",
};

export default function EstimatePage() {
  return (
    <SiteShell>
      <EstimateWizard />
    </SiteShell>
  );
}
