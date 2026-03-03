import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SwapStationMapData } from "@/types";

interface SwapStatsTableProps {
  stations: SwapStationMapData[];
}

const statusVariant: Record<
  SwapStationMapData["status"],
  "default" | "secondary" | "destructive"
> = {
  online: "default",
  offline: "destructive",
  maintenance: "secondary",
};

export function SwapStatsTable({ stations }: SwapStatsTableProps) {
  const sorted = [...stations].sort((a, b) => b.todaySwaps - a.todaySwaps);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Performance — Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Station</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Swaps Today</th>
                <th className="pb-3 font-medium text-right">Available</th>
                <th className="pb-3 font-medium text-right">Total Slots</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((station) => (
                <tr key={station.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{station.name}</td>
                  <td className="py-2 text-muted-foreground">
                    {station.address}
                  </td>
                  <td className="py-2">
                    <Badge variant={statusVariant[station.status]}>
                      {station.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-right tabular-nums font-medium">
                    {station.todaySwaps}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {station.availableBatteries}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {station.totalSlots}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
