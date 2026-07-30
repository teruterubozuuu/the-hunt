"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { status } from "@/utils/app/constants";
import React, { useState } from "react";

type StatusSelectProps = {
  defaultValue?: string;
};

export default function StatusSelect({ defaultValue }: StatusSelectProps) {
  const items = status.map((item) => ({ value: item.id, label: item.type }));
  
  const [value, setValue] = useState(defaultValue ?? status[0].id);
  
  const handleValueChange = (newValue: string | null) => {
    if (newValue !== null) {
      setValue(newValue);
    }
  };

  return (
    <Select
      name="status"
      items={items}
      value={value}
      onValueChange={handleValueChange}
      modal={false}
    >
      <SelectTrigger className="border-2 border-foreground cursor-pointer w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {status.map((item) => (
          <SelectItem value={item.id} key={item.id} className="cursor-pointer">
            {item.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
