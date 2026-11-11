"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  cleanPath,
  cleanReferrer,
  cleanUtm,
  isSitePath,
  type LeadAttribution,
} from "@/lib/lead-attribution";

const LANDING_KEY = "abc_attr";
const FROM_KEY = "abc_from_page";

function readSaved(): Partial<LeadAttribution> {
  try {
    const raw = sessionStorage.getItem(LANDING_KEY);
    return raw ? (JSON.parse(raw) as Partial<LeadAttribution>) : {};
  } catch {
    return {};
  }
}

export function rememberFromPage(pathname: string) {
  if (typeof window === "undefined") return;
  const path = cleanPath(pathname);
  if (path && path !== "/estimate") sessionStorage.setItem(FROM_KEY, path);
}

export function rememberLanding() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const saved = readSaved();
  if (!saved.landingPage) {
    const next = {
      landingPage: cleanPath(window.location.pathname, "/"),
      referrer: cleanReferrer(document.referrer),
      utmSource: cleanUtm(params.get("utm_source") || ""),
      utmMedium: cleanUtm(params.get("utm_medium") || ""),
      utmCampaign: cleanUtm(params.get("utm_campaign") || ""),
    };
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(next));
    return;
  }
  if (!saved.utmSource && params.get("utm_source")) {
    sessionStorage.setItem(
      LANDING_KEY,
      JSON.stringify({
        ...saved,
        utmSource: cleanUtm(params.get("utm_source") || ""),
        utmMedium: cleanUtm(params.get("utm_medium") || saved.utmMedium || ""),
        utmCampaign: cleanUtm(params.get("utm_campaign") || saved.utmCampaign || ""),
      }),
    );
  }
}

export function collectAttribution(formPage: string): LeadAttribution {
  rememberLanding();
  const saved = readSaved();
  const fromPage = typeof window === "undefined" ? "" : sessionStorage.getItem(FROM_KEY) || "";
  const landingPage = cleanPath(saved.landingPage || "");
  const form = cleanPath(formPage, "/estimate") || "/estimate";
  const preferred = [fromPage, landingPage].find((path) => path && isSitePath(path)) || form;
  return {
    sourcePage: preferred,
    formPage: form,
    landingPage,
    referrer: cleanReferrer(saved.referrer || ""),
    utmSource: cleanUtm(saved.utmSource || ""),
    utmMedium: cleanUtm(saved.utmMedium || ""),
    utmCampaign: cleanUtm(saved.utmCampaign || ""),
  };
}

export function appendAttribution(body: FormData, formPage: string) {
  const attr = collectAttribution(formPage);
  body.set("sourcePage", attr.sourcePage);
  body.set("formPage", attr.formPage);
  body.set("landingPage", attr.landingPage);
  body.set("referrer", attr.referrer);
  body.set("utmSource", attr.utmSource);
  body.set("utmMedium", attr.utmMedium);
  body.set("utmCampaign", attr.utmCampaign);
}

function TrackerInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  useEffect(() => {
    rememberLanding();
    if (pathname && pathname !== "/estimate") rememberFromPage(pathname);
  }, [pathname, search]);
  return null;
}

export function LeadAttributionTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
