import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { WindowsTool } from "@/components/windows/windows-tool";
import { pageCanonical } from "@/lib/site";
import { SERVICE_AREA_WINDOWS } from "@/lib/windows";

export const metadata: Metadata = {
  title: "Window estimate",
  description: `Get a ballpark for new windows. We'll call to discuss your windows, then set a time to take measurements for the real quote. ${SERVICE_AREA_WINDOWS}`,
  alternates: { canonical: pageCanonical("/windows") },
};

export default function WindowsPage() {
  return (
    <SiteShell>
      <main id="content" tabIndex={-1}>
        <WindowsTool />
      </main>
    </SiteShell>
  );
}
