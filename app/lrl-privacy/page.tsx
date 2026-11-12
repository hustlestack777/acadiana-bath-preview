import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Contact privacy",
  description: "How Lagniappe Realm Labs LLC uses information you send from the site credit form.",
  robots: { index: false, follow: false },
};

const LAST_UPDATED = "November 12, 2026";

export default function LrlPrivacyPage() {
  return (
    <SiteShell>
      <main id="content" tabIndex={-1} className="mx-auto w-full max-w-3xl px-5 py-12 md:py-16">
        <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Privacy</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Contact privacy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 grid gap-6 text-lg leading-8">
          <p>
            If you use the &ldquo;Designed &amp; marketed by Lagniappe Realm Labs&rdquo; form, the information you send
            goes to Shaun Brasher at Lagniappe Realm Labs LLC so he can respond to your request.
          </p>
          <p>
            That information is used only to respond to your request. It is not sold or shared with anyone else, except
            the services needed to deliver the message (such as email).
          </p>
          <p>
            We don&apos;t send text messages right now. If you share a phone number or email, Shaun may reply by phone
            or email. If we add texting later, we&apos;ll ask for your consent first and update this page. You can
            ask him to stop at any time by telling him, or by emailing{" "}
            <a href="mailto:shaun@lagniapperealmlabs.com" className="underline underline-offset-4">
              shaun@lagniapperealmlabs.com
            </a>.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
