import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { brand } from "@/lib/copy";
import { pageCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Acadiana Bathrooms and Countertops handles the information you share when you ask for a quote.",

  alternates: { canonical: pageCanonical("/privacy") },
};

const LAST_UPDATED = "November 12, 2026";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main id="content" tabIndex={-1} className="mx-auto w-full max-w-3xl px-5 py-12 md:py-16">
        <p className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">Privacy</p>
        <h1 className="mt-3 text-5xl md:text-6xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 grid gap-8 text-lg leading-8 [&_h2]:text-3xl [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:ps-6">
          <section>
            <p>
              This page explains, in plain English, what {brand.name} collects when you ask for a quote, why, and what
              you can do about it.
            </p>
          </section>

          <section>
            <h2>What we collect</h2>
            <ul>
              <li>Your name, phone number and email address.</li>
              <li>The street address, town and ZIP code of the home.</li>
              <li>Project details you choose or type, like the kind of work, timing, colors or notes.</li>
              <li>Photos you choose to upload.</li>
            </ul>
            <p className="mt-3">
              We only get this information when you type it into a form, send it in a lead form (for example, from a
              Facebook or Instagram ad), call, or email us.
            </p>
          </section>

          <section>
            <h2>Why we collect it</h2>
            <p>
              To give you a quote and to contact you about your project. That&apos;s it.
            </p>
          </section>

          <section>
            <h2>Who sees it</h2>
            <p>
              Your information goes to {brand.name} and our marketing partner, Lagniappe Realm Labs LLC, which helps run this website and follow up
              on quote requests. We also use a few service providers to run the site, such as website hosting, email
              delivery and address lookup. They handle your information only to provide those services to us.
            </p>
            <p className="mt-3 font-medium">We never sell your information.</p>
          </section>

          <section>
            <h2>Design My Bathroom photos</h2>
            <p>
              When you use Design My Bathroom, your photo is sent to an AI image service to make your design preview. We use
              your photos and design only to make the design and prepare your estimate, never for ads.
            </p>
          </section>

          <section>
            <h2>Text messages</h2>
            <p>
              We don&apos;t send text messages right now. We reply by phone or email. If we add texting later,
              we&apos;ll ask for your consent first and update this policy.
            </p>
          </section>

          <section>
            <h2>Cookies and analytics</h2>
            <p>
              This site does not use analytics or ad tracking. The Design My Bathroom tool sets one small cookie so we
              can count your free designs. If that changes, we will update this page first.
            </p>
          </section>

          <section>
            <h2>Getting your information deleted</h2>
            <p>
              Email{" "}
              <a href={brand.emailHref} className="underline underline-offset-4">
                {brand.email}
              </a>{" "}
              and ask us to delete your information. We will delete it and let you know when it&apos;s done.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p>
              Call{" "}
              <a href={brand.phoneHref} className="underline underline-offset-4">
                {brand.phone}
              </a>{" "}
              or email{" "}
              <a href={brand.emailHref} className="underline underline-offset-4">
                {brand.email}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
