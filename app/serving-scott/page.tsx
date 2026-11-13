import type { Metadata } from "next";
import { ServingTownPage, townMetadata } from "@/lib/serving-page";

export const metadata: Metadata = townMetadata("scott");

export default function Page() {
  return <ServingTownPage slug="scott" />;
}
