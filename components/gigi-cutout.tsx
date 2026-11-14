import { cn } from "cn";
import { gigiLookSrc, type GigiLook } from "@/lib/gigi-looks";

/** Full-torso Gigi cutout for the chat launcher. Desktop uses the
 *  larger WebP; the small source is eager. The larger file is lazy-loaded
 *  when the chat opens on small screens. */
export function GigiCutout({
  look,
  className,
  loadFull = false,
}: {
  look: GigiLook | null;
  className?: string;
  loadFull?: boolean;
}) {
  if (!look) return null;
  const full = gigiLookSrc(look, "full");
  const small = gigiLookSrc(look, "sm");
  return (
    <picture className={cn("pointer-events-none", className)} data-gigi-look={look}>
      {loadFull ? <source type="image/webp" srcSet={full} /> : null}
      <source type="image/webp" media="(min-width: 768px)" srcSet={full} />
      <img
        className="gigi-cutout"
        src={small}
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
  look,
  size = 40,
  className,
  alt = "",
}: {
  look: GigiLook | null;
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
      {look ? (
        <img
          src={gigiLookSrc(look, "sm")}
          alt={alt}
          width={size}
          height={height}
          decoding="async"
          draggable={false}
          className="h-full w-auto max-w-none bg-transparent object-cover object-[50%_8%]"
        />
      ) : null}
    </span>
  );
}
