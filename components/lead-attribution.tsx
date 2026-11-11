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

const COOKIE_KEY = "abc_attr";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function persist(next: Partial<LeadAttribution>) {
  const raw = JSON.stringify(next);
  try {
    sessionStorage.setItem(LANDING_KEY, raw);
  } catch {
    /* ignore quota / private mode */
  }
  try {
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(raw)};Path=/;Max-Age=${COOKIE_MAX_AGE};SameSite=Lax${secure}`;
  } catch {
    /* ignore cookie write failures */
  }
}

function readCookie(): Partial<LeadAttribution> {
  try {
    const parts = document.cookie.split(";").map((part) => part.trim());
    const row = parts.find((part) => part.startsWith(`${COOKIE_KEY}=`));
    if (!row) return {};
    return JSON.parse(decodeURIComponent(row.slice(COOKIE_KEY.length + 1))) as Partial<LeadAttribution>;
  } catch {
    return {};
  }
}

export function rememberLanding() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const saved = { ...readCookie(), ...readSaved() };
  const incoming = {
    src: cleanUtm(params.get("src") || ""),
    utmSource: cleanUtm(params.get("utm_source") || ""),
    utmMedium: cleanUtm(params.get("utm_medium") || ""),
    utmCampaign: cleanUtm(params.get("utm_campaign") || ""),
  };
  if (!saved.landingPage) {
    persist({
      landingPage: cleanPath(window.location.pathname, "/"),
      referrer: cleanReferrer(document.referrer),
      ...incoming,
    });
    return;
  }
  const next = { ...saved };
  let changed = false;
  for (const key of ["src", "utmSource", "utmMedium", "utmCampaign"] as const) {
    if (!next[key] && incoming[key]) {
      next[key] = incoming[key];
      changed = true;
    }
  }
  if (changed) persist(next);
}

export function collectAttribution(formPage: string): LeadAttribution {
  rememberLanding();
  const saved = { ...readCookie(), ...readSaved() };
  const fromPage = typeof window === "undefined" ? "" : sessionStorage.getItem(FROM_KEY) || "";
  const landingPage = cleanPath(saved.landingPage || "");
  const form = cleanPath(formPage, "/estimate") || "/estimate";
  const preferred = [fromPage, landingPage].find((path) => path && isSitePath(path)) || form;
  return {
    sourcePage: preferred,
    formPage: form,
    landingPage,
    referrer: cleanReferrer(saved.referrer || ""),
    src: cleanUtm(saved.src || ""),
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
  body.set("src", attr.src);
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
