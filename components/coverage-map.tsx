/** Boogie's gold service-area map. Served from /public/maps; no tile keys. */

type CoverageMapProps = {
  size?: "full" | "compact";
  /** Keep the right edge clear of the tucked chat launcher. */
  clearRight?: boolean;
};

export function CoverageMap({ size = "full", clearRight = false }: CoverageMapProps) {
  const compact = size === "compact";
  return (
    <figure
      className={
        clearRight
          ? "coverage-map-clear"
          : compact
            ? "mx-auto mt-8 w-full max-w-5xl max-md:max-w-none max-md:-me-[var(--chat-gutter,0px)] max-md:w-[calc(100%+var(--chat-gutter,0px))]"
            : "mx-auto mt-8 w-full max-w-6xl max-md:max-w-none max-md:-me-[var(--chat-gutter,0px)] max-md:w-[calc(100%+var(--chat-gutter,0px))]"
      }
    >
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
