"use client";

import { useEffect, useState } from "react";
import { Plus, Users, UserCheck, Bike, Route } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loadOpsRiders, addOpsRider, seedOpsIfEmpty } from "@/lib/ops-storage";
import type { Rider } from "@/types";
import type { SpvFormField } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "name", label: "Full Name", type: "text", section: "technical", placeholder: "e.g. James Mwangi", required: true },
  { name: "phone", label: "Phone Number", type: "text", section: "technical", placeholder: "+254 7XX XXX XXX", required: true },
  { name: "email", label: "Email Address", type: "text", section: "technical", placeholder: "name@email.com" },
  { name: "assignedBikeId", label: "Assigned Bike ID", type: "text", section: "utilization", placeholder: "OPS-BK-XXX" },
];

const statusVariant: Record<Rider["status"], "default" | "secondary" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  suspended: "destructive",
};

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedOpsIfEmpty();
    setRiders(loadOpsRiders());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `OPS-RD-${String(riders.length + 1).padStart(3, "0")}`;
    const newRider: Rider = {
      id,
      name: String(data.name || ""),
      phone: String(data.phone || ""),
      email: String(data.email || ""),
      status: "active",
      assignedBikeId: data.assignedBikeId ? String(data.assignedBikeId) : null,
      totalTrips: 0,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    const updated = addOpsRider(newRider);
    setRiders(updated);
  }

  const totalRiders = riders.length;
  const activeCount = riders.filter((r) => r.status === "active").length;
  const assignedCount = riders.filter((r) => r.assignedBikeId !== null).length;
  const totalTrips = riders.reduce((s, r) => s + r.totalTrips, 0);

  return (
    <>
      <Header title="Riders" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Riders"
            description="Manage riders on the platform."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rider
          </Button>
        </div>

        <SpvBanner
          accentColor="purple"
          title="Fleet Operations — Riders"
          description="Manage your rider workforce. Track rider status, bike assignments, trip activity, and onboarding across the platform."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Riders"
            value={totalRiders}
            description="Registered on platform"
            icon={Users}
          />
          <KpiCard
            title="Active"
            value={activeCount}
            description="Currently active"
            icon={UserCheck}
          />
          <KpiCard
            title="Assigned Bikes"
            value={assignedCount}
            description="Riders with bikes"
            icon={Bike}
          />
          <KpiCard
            title="Total Trips"
            value={totalTrips.toLocaleString()}
            description="Cumulative trips"
            icon={Route}
          />
        </div>

        {riders.length === 0 ? (
          <SpvEmptyState assetLabel="Rider" onAdd={() => setFormOpen(true)} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Bike</TableHead>
                    <TableHead className="text-right">Total Trips</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riders.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell className="font-medium">{rider.name}</TableCell>
                      <TableCell className="text-muted-foreground">{rider.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{rider.email}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[rider.status]}>
                          {rider.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {rider.assignedBikeId ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {rider.totalTrips.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(rider.joinedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <SpvAddForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add Rider"
          fields={FORM_FIELDS}
          onSubmit={handleAdd}
        />
      </div>
    </>
  );
}
