import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";
import { FIRST_HERO_PRELOAD } from "@/lib/hero-slides";

export default function Page() {
  return (
    <SiteShell sticky bleed>
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href={FIRST_HERO_PRELOAD.href}
        imageSrcSet={FIRST_HERO_PRELOAD.srcSet}
        imageSizes="100vw"
        fetchPriority="high"
      />
      <HomePage />
    </SiteShell>
  );
}
