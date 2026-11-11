import type { Metadata } from "next";
import { ServingTownPage, townMetadata } from "@/lib/serving-page";

export const metadata: Metadata = townMetadata("crowley");

export default function Page() {
  return <ServingTownPage slug="crowley" />;
}
