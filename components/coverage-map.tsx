/** Boogie's gold service-area map. Served from /public/maps; no tile keys. */

type CoverageMapProps = {
  size?: "full" | "compact";
};

export function CoverageMap({ size = "full" }: CoverageMapProps) {
  const compact = size === "compact";
  return (
    <figure className={compact ? "mx-auto mt-8 w-full max-w-lg" : "mx-auto mt-8 w-full max-w-4xl"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/maps/acadiana_service_map.svg"
        alt="Map of the South Louisiana service area for Acadiana Bathrooms, with served parishes highlighted and town labels."
        width={1000}
        height={871}
        className="h-auto w-full"
        decoding="async"
        loading={compact ? "lazy" : "eager"}
      />
    </figure>
  );
}
