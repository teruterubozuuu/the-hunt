"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employmentType } from "@/utils/app/constants";
import React, { useState } from "react";

export default function EmploymentTypeSelect() {
  const items = employmentType.map((item) => ({
    value: item.type,
    label: item.type,
  }));
  const [value, setValue] = useState(employmentType[0].type);
  
  const handleValueChange = (newValue: string | null) => {
    if (newValue !== null) {
      setValue(newValue);
    }
  };

  return (
    <Select
      name="employmentType"
      items={items}
      value={value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="border-2 border-foreground cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {employmentType.map((item) => (
          <SelectItem key={item.id} value={item.type} className="cursor-pointer">
            {item.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
