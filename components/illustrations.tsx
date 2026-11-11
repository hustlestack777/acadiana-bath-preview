export function ShowerStudy() {
  return (
    <figure className="relative">
      <div className="rounded-[2rem] border border-hero-muted/30 bg-hero-foreground/5 p-4 sm:p-6">
        <svg
          viewBox="0 0 360 460"
          role="img"
          aria-label="Abstract shower alcove made of color panels."
          className="h-auto w-full"
        >
          <rect x="18" y="18" width="324" height="424" rx="28" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="46" y="46" width="82" height="332" rx="10" fill="var(--brass-soft)" />
          <rect x="140" y="46" width="84" height="332" rx="10" fill="var(--hero-foreground)" />
          <rect x="236" y="46" width="78" height="332" rx="10" fill="var(--swatch-clay)" />
          <rect x="158" y="156" width="48" height="72" rx="6" fill="var(--swatch-lagoon)" />
          <rect x="46" y="354" width="268" height="16" rx="4" fill="var(--swatch-brass)" />
          <path d="M168 78h28" stroke="var(--hero)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </figure>
  );
}

const frames = [
  function Wide() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--tint-lagoon)" />
        <rect x="24" y="28" width="46" height="194" rx="6" fill="var(--swatch-lagoon)" />
        <rect x="78" y="28" width="52" height="194" rx="6" fill="var(--brass-soft)" />
        <rect x="138" y="28" width="40" height="194" rx="6" fill="var(--swatch-clay)" />
      </svg>
    );
  },
  function Shower() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--tint-brass)" />
        <path d="M40 210 V90 a60 60 0 0 1 120 0 V210" fill="none" stroke="var(--swatch-fig)" strokeWidth="14" />
        <rect x="70" y="120" width="60" height="70" rx="6" fill="var(--swatch-lagoon)" />
      </svg>
    );
  },
  function Tub() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--tint-clay)" />
        <rect x="24" y="40" width="152" height="28" rx="6" fill="var(--swatch-clay)" />
        <rect x="24" y="80" width="152" height="28" rx="6" fill="var(--brass-soft)" />
        <rect x="24" y="120" width="152" height="28" rx="6" fill="var(--swatch-lagoon)" />
        <rect x="24" y="168" width="152" height="42" rx="21" fill="var(--hero)" />
      </svg>
    );
  },
  function Niche() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--sage-wash)" />
        <rect x="36" y="36" width="128" height="178" rx="8" fill="var(--swatch-brass)" />
        <rect x="58" y="70" width="84" height="96" rx="6" fill="var(--card)" />
      </svg>
    );
  },
  function Corner() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--tint-lagoon)" />
        <circle cx="40" cy="210" r="110" fill="var(--swatch-fig)" />
        <circle cx="170" cy="40" r="70" fill="var(--swatch-brass)" />
      </svg>
    );
  },
  function Finish() {
    return (
      <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="250" fill="var(--tint-brass)" />
        <rect x="28" y="28" width="64" height="64" rx="8" fill="var(--swatch-clay)" />
        <rect x="108" y="28" width="64" height="64" rx="8" fill="var(--swatch-lagoon)" />
        <rect x="28" y="108" width="64" height="64" rx="8" fill="var(--swatch-fig)" />
        <rect x="108" y="108" width="64" height="64" rx="8" fill="var(--brass)" />
        <rect x="28" y="188" width="144" height="28" rx="8" fill="var(--hero)" />
      </svg>
    );
  },
];

export function GalleryArt({ index }: { index: number }) {
  const Art = frames[index] ?? frames[0];
  return <Art />;
}
