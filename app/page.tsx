import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";

export default function Page() {
  return (
    <SiteShell sticky bleed>
      <HomePage />
    </SiteShell>
  );
}
