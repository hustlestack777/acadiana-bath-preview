import { cn } from "cn";

/** Gigi's portrait. Circular crop is applied with CSS. */
export function GigiAvatar({
  size = 40,
  className,
  alt = "",
}: {
  size?: number;
  className?: string;
  alt?: string;
}) {
  const file = size > 48 ? "gigi-256" : "gigi-96";
  return (
    <picture>
      <source type="image/webp" srcSet={`/images/gigi/${file}.webp`} />
      <img
        src={`/images/gigi/${file}.jpg`}
        alt={alt}
        width={size}
        height={size}
        decoding="async"
        className={cn("rounded-full object-cover", className)}
      />
    </picture>
  );
}
