import { cn } from "@/lib/utils";

interface MobilityXLogoProps {
  className?: string;
  size?: number;
}

/**
 * MobilityX Africa logo — stylised lightning bolt in a circle,
 * representing electric mobility across the continent.
 */
export function MobilityXLogo({ className, size = 32 }: MobilityXLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="MobilityX Africa"
    >
      {/* Outer circle */}
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      {/* Inner accent ring */}
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      {/* Lightning bolt — the 'X' in MobilityX */}
      <path
        d="M27 10L18 26h6l-3 12 12-18h-7l1-10z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Small circuit dots */}
      <circle cx="14" cy="18" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="34" cy="30" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="12" cy="30" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="36" cy="18" r="1.5" fill="currentColor" fillOpacity="0.5" />
      {/* Circuit lines connecting dots to bolt */}
      <line x1="15.5" y1="18" x2="20" y2="22" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="32.5" y1="30" x2="28" y2="28" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="13.5" y1="30" x2="18" y2="28" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="34.5" y1="18" x2="30" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
    </svg>
  );
}

/**
 * Compact icon-only variant for favicon / small spaces.
 */
export function MobilityXIcon({ className, size = 16 }: MobilityXLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="MobilityX"
    >
      <circle cx="24" cy="24" r="22" fill="currentColor" />
      <path
        d="M27 10L18 26h6l-3 12 12-18h-7l1-10z"
        fill="white"
      />
    </svg>
  );
}
