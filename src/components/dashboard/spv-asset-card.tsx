"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssetStatus, SpvCardItem } from "@/types/spv";

interface SpvAssetCardProps {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  accentColor: "green" | "blue" | "orange" | "purple";
  technical: SpvCardItem[];
  utilization: SpvCardItem[];
  financial: SpvCardItem[];
}

const borderTopColors = {
  green: "border-t-green-500",
  blue: "border-t-blue-500",
  orange: "border-t-orange-500",
  purple: "border-t-purple-500",
};

const highlightBg = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  orange: "bg-orange-50 text-orange-700",
  purple: "bg-purple-50 text-purple-700",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "destructive",
  maintenance: "secondary",
  "in-use": "default",
  available: "secondary",
  retired: "outline",
  charging: "secondary",
  online: "default",
  offline: "destructive",
};

function ItemRow({
  item,
  accentColor,
}: {
  item: SpvCardItem;
  accentColor: "green" | "blue" | "orange" | "purple";
}) {
  if (item.highlight) {
    return (
      <div
        className={`flex items-baseline justify-between rounded-md px-2 py-1.5 ${highlightBg[accentColor]}`}
      >
        <span className="text-xs font-medium">{item.label}</span>
        <span className="text-base font-bold tabular-nums">
          {item.value}
          {item.suffix && (
            <span className="ml-0.5 text-xs font-normal">{item.suffix}</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-xs text-muted-foreground">{item.label}</span>
      <span className="text-sm font-medium tabular-nums">
        {item.value}
        {item.suffix && (
          <span className="ml-0.5 text-xs text-muted-foreground">
            {item.suffix}
          </span>
        )}
      </span>
    </div>
  );
}

export function SpvAssetCard({
  id,
  title,
  subtitle,
  status,
  accentColor,
  technical,
  utilization,
  financial,
}: SpvAssetCardProps) {
  return (
    <Card className={`border-t-4 ${borderTopColors[accentColor]}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">{title}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant={statusVariant[status]}>{status}</Badge>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">{id}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="technical" className="flex-1">
              Technical
            </TabsTrigger>
            <TabsTrigger value="utilization" className="flex-1">
              Utilization
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex-1">
              Financial
            </TabsTrigger>
          </TabsList>
          <TabsContent value="technical" className="mt-3 space-y-0.5">
            {technical.map((item) => (
              <ItemRow
                key={item.label}
                item={item}
                accentColor={accentColor}
              />
            ))}
          </TabsContent>
          <TabsContent value="utilization" className="mt-3 space-y-0.5">
            {utilization.map((item) => (
              <ItemRow
                key={item.label}
                item={item}
                accentColor={accentColor}
              />
            ))}
          </TabsContent>
          <TabsContent value="financial" className="mt-3 space-y-0.5">
            {financial.map((item) => (
              <ItemRow
                key={item.label}
                item={item}
                accentColor={accentColor}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
