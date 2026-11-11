import type { Metadata } from "next";
import { CoverageMap } from "@/components/coverage-map";
import { FaqSection } from "@/components/faq-section";
import { SiteShell } from "@/components/site-shell";
import { WarrantySection } from "@/components/warranty-section";
import { faqMore, faqPageIntro, faqPageTitle, faqVisible } from "@/lib/faq-page";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: faqPageTitle,
  description: faqPageIntro,

  alternates: { canonical: pageCanonical("/faq") },
};

export default function FaqPage() {
  return (
    <SiteShell sticky>
      <main id="content" tabIndex={-1}>
        <section className="mx-auto w-full max-w-6xl px-5 pb-4 pt-6 md:pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">FAQ</p>
          <h1 className="mt-3 max-w-4xl font-heading text-4xl leading-[1.05] md:text-6xl">{faqPageTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{faqPageIntro}</p>
          <CoverageMap size="compact" />
        </section>
        <FaqSection faqs={faqVisible} moreFaqs={faqMore} heading="Questions" className="bg-transparent pt-4 md:pt-6" />
        <WarrantySection />
      </main>
    </SiteShell>
  );
}
