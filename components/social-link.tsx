import { facebookProfile } from "@/lib/social";
import { cn } from "cn";

/** Facebook icon for the profile already stored in schema sameAs. */
export function FacebookLink({ className }: { className?: string }) {
  const href = facebookProfile();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      data-testid="facebook-link"
      className={cn("inline-flex size-11 items-center justify-center rounded-full border", className)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
        <path d="M14.2 8.5V6.9c0-.7.4-1 1.1-1H17V3.2h-2.2C12.1 3.2 11 4.6 11 6.7v1.8H9v2.6h2V21h3.2v-9.9h2.2l.4-2.6h-2.6z" />
      </svg>
    </a>
  );
}
