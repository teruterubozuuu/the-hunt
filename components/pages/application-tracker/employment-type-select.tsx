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

type EmploymentTypeSelectProps = {
  defaultValue? :string;
}

export default function EmploymentTypeSelect({defaultValue}: EmploymentTypeSelectProps) {
  const items = employmentType.map((item) => ({
    value: item.id,
    label: item.type,
  }));
  const [value, setValue] = useState(defaultValue ?? employmentType[0].id);
  
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
          <SelectItem key={item.id} value={item.id} className="cursor-pointer">
            {item.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
