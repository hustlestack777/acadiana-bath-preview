import type { Metadata } from "next";
import { ServingTownPage, townMetadata } from "@/lib/serving-page";

export const metadata: Metadata = townMetadata("youngsville");

export default function Page() {
  return <ServingTownPage slug="youngsville" />;
}
