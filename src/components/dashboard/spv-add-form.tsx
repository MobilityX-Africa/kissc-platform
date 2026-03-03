"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SpvFormField } from "@/types/spv";

interface SpvAddFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: SpvFormField[];
  onSubmit: (data: Record<string, string | number>) => void;
}

const sectionLabels: Record<string, string> = {
  technical: "Technical Details",
  utilization: "Utilization",
  financial: "Financial",
};

export function SpvAddForm({
  open,
  onOpenChange,
  title,
  fields,
  onSubmit,
}: SpvAddFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data: Record<string, string | number> = {};
    for (const field of fields) {
      const raw = values[field.name] ?? "";
      data[field.name] = field.type === "number" ? Number(raw) || 0 : raw;
    }

    onSubmit(data);
    setValues({});
    onOpenChange(false);
  }

  const sections = ["technical", "utilization", "financial"] as const;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {sections.map((section) => {
            const sectionFields = fields.filter((f) => f.section === section);
            if (sectionFields.length === 0) return null;
            return (
              <div key={section}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {sectionLabels[section]}
                </h4>
                <div className="space-y-3">
                  {sectionFields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === "select" ? (
                        <Select
                          value={values[field.name] ?? ""}
                          onValueChange={(v) =>
                            setValues((prev) => ({ ...prev, [field.name]: v }))
                          }
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue
                              placeholder={field.placeholder ?? "Select..."}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={values[field.name] ?? ""}
                          onChange={(e) =>
                            setValues((prev) => ({
                              ...prev,
                              [field.name]: e.target.value,
                            }))
                          }
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <Button type="submit" className="w-full">
            Add Asset
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
