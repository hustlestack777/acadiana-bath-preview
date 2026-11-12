import { cn } from "cn";

/** Full-torso Camille cutout for the chat launcher. Desktop uses the
 *  larger WebP; the small source is eager. The larger file is lazy-loaded
 *  when the chat opens on small screens. */
export function CamilleCutout({
  className,
  loadFull = false,
}: {
  className?: string;
  loadFull?: boolean;
}) {
  return (
    <picture className={cn("pointer-events-none", className)}>
      {loadFull ? <source type="image/webp" srcSet="/images/camille/camille-tiles.webp" /> : null}
      <source
        type="image/webp"
        media="(min-width: 768px)"
        srcSet="/images/camille/camille-tiles.webp"
      />
      <img
        className="camille-cutout"
        src="/images/camille/camille-tiles-sm.webp"
        alt=""
        width={298}
        height={520}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

/** Small circular crop of Camille for chat-message rows. */
export function CamilleFace({
  size = 40,
  className,
  alt = "",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0 overflow-hidden rounded-full", className)}>
      <img
        src="/images/camille/camille-tiles-sm.webp"
        alt={alt}
        width={size}
        height={size}
        decoding="async"
        className="size-full object-cover object-[50%_12%]"
      />
    </span>
  );
}
