import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { WindowsTool } from "@/components/windows/windows-tool";
import { windowServiceJsonLd } from "@/lib/schema";
import { pageCanonical } from "@/lib/site";
import { SERVICE_AREA_WINDOWS, WINDOW_PRICE_LINE } from "@/lib/windows";

export const metadata: Metadata = {
  title: "Window estimate",
  description: `${WINDOW_PRICE_LINE} We'll call to discuss your windows, then set a time to take measurements for the real quote. ${SERVICE_AREA_WINDOWS}`,
  alternates: { canonical: pageCanonical("/windows") },
};

export default function WindowsPage() {
  return (
    <SiteShell>
      <JsonLd data={windowServiceJsonLd()} />
      <main id="content" tabIndex={-1}>
        <WindowsTool />
      </main>
    </SiteShell>
  );
}
