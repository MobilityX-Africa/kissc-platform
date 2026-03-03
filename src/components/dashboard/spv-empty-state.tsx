import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpvEmptyStateProps {
  assetLabel: string;
  onAdd: () => void;
}

export function SpvEmptyState({ assetLabel, onAdd }: SpvEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <PackageOpen className="h-12 w-12 text-muted-foreground/40" />
      <h3 className="mt-4 text-lg font-medium">No {assetLabel} yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your first {assetLabel.toLowerCase()} to start tracking SPV
        performance.
      </p>
      <Button className="mt-4" onClick={onAdd}>
        Add {assetLabel}
      </Button>
    </div>
  );
}
