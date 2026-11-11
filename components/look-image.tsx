import Image from "next/image";

type LookImageProps = {
  src: string;
  jpg?: string;
  alt: string;
  sizes: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/** WebP with a JPEG fallback when `jpg` is set; otherwise a regular Next image. */
export function LookImage({ src, jpg, alt, sizes, className, loading = "lazy" }: LookImageProps) {
  if (!jpg) {
    return <Image src={src} alt={alt} fill sizes={sizes} loading={loading} className={className} />;
  }

  return (
    <picture>
      <source type="image/webp" srcSet={src} sizes={sizes} />
      <img
        src={jpg}
        alt={alt}
        sizes={sizes}
        loading={loading}
        decoding="async"
        className={["absolute inset-0 h-full w-full", className].filter(Boolean).join(" ")}
      />
    </picture>
  );
}
