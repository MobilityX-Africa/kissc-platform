import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobilityXLogoProps {
  className?: string;
  size?: number;
}

/**
 * MobilityX Africa logo — Africa-shaped network/circuit design
 * with colored dots representing e-mobility infrastructure.
 */
export function MobilityXLogo({ className, size = 32 }: MobilityXLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="MobilityX Africa"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority
    />
  );
}

/**
 * Compact icon-only variant for small spaces.
 */
export function MobilityXIcon({ className, size = 16 }: MobilityXLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="MobilityX Africa"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
