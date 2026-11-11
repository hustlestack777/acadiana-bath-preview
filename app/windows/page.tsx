import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { WindowsTool } from "@/components/windows/windows-tool";
import { siteRobots } from "@/lib/site";
import { SERVICE_AREA_WINDOWS } from "@/lib/windows";

export const metadata: Metadata = {
  title: "Window estimate",
  description: `Get a ballpark for new windows. Justin measures for the real quote. ${SERVICE_AREA_WINDOWS}`,
  robots: siteRobots,
};

export default function WindowsPage() {
  return (
    <SiteShell chat={false}>
      <main id="content" tabIndex={-1}>
        <WindowsTool />
      </main>
    </SiteShell>
  );
}
