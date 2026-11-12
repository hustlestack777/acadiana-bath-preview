import { cn } from "cn";

/** Full-torso Gigi cutout for the chat launcher. Desktop uses the
 *  larger WebP; the small source is eager. The larger file is lazy-loaded
 *  when the chat opens on small screens. */
export function GigiCutout({
  className,
  loadFull = false,
}: {
  className?: string;
  loadFull?: boolean;
}) {
  return (
    <picture className={cn("pointer-events-none", className)}>
      {loadFull ? <source type="image/webp" srcSet="/images/gigi/gigi-tiles.webp" /> : null}
      <source
        type="image/webp"
        media="(min-width: 768px)"
        srcSet="/images/gigi/gigi-tiles.webp"
      />
      <img
        className="gigi-cutout"
        src="/images/gigi/gigi-tiles-sm.webp"
        alt=""
        width={298}
        height={520}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

/** Small frameless upper-torso cutout for the open-chat header and
 *  message rows. No circle, border, or background. */
export function GigiFace({
  size = 40,
  className,
  alt = "",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  const height = Math.round(size * 1.55);
  return (
    <span
      className={cn("inline-flex shrink-0 items-end justify-center overflow-hidden bg-transparent", className)}
      style={{ width: size, height }}
    >
      <img
        src="/images/gigi/gigi-tiles-sm.webp"
        alt={alt}
        width={size}
        height={height}
        decoding="async"
        draggable={false}
        className="h-full w-auto max-w-none bg-transparent object-cover object-[50%_8%]"
      />
    </span>
  );
}
