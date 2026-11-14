import { socialProfiles, type SocialProfile } from "@/lib/social";
import { cn } from "cn";

function Icon({ kind }: { kind: SocialProfile["kind"] }) {
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
        <path d="M14.2 8.5V6.9c0-.7.4-1 1.1-1H17V3.2h-2.2C12.1 3.2 11 4.6 11 6.7v1.8H9v2.6h2V21h3.2v-9.9h2.2l.4-2.6h-2.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M12 11.2v2.3h6.4c-.3 1.5-1.8 4.4-6.4 4.4-3.8 0-7-3.2-7-7s3.1-7 7-7c2.2 0 3.6.9 4.5 1.7l1.5-1.5C16.6 2.6 14.6 1.7 12 1.7 6.8 1.7 2.6 5.9 2.6 11.1S6.8 20.5 12 20.5c6.9 0 8.2-6.1 7.6-9.3H12z" />
    </svg>
  );
}

/** Facebook and the one Google Business listing, side by side. */
export function SocialLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  const profiles = socialProfiles();
  if (!profiles.length) return null;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {profiles.map((profile) => (
        <a
          key={profile.kind}
          href={profile.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={profile.label}
          data-testid={`${profile.kind}-link`}
          className={cn("inline-flex size-11 items-center justify-center rounded-full border", itemClassName)}
        >
          <Icon kind={profile.kind} />
        </a>
      ))}
    </div>
  );
}
