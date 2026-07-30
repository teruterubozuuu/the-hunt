"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workSetup } from "@/utils/app/constants";
import { useState } from "react";

export default function WorkSetupSelect() {
  const items = workSetup.map((item) => ({ value: item.type, label: item.type }));

    const [value, setValue] = useState(workSetup[0].type);
    
    const handleValueChange = (newValue: string | null) => {
      if (newValue !== null) {
        setValue(newValue);
      }
    };

  return (
    <Select
      name="workSetup"
      items={items}
      value={value}
      onValueChange={handleValueChange}
      modal={false}
    >
      <SelectTrigger className="border-2 border-foreground cursor-pointer w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {workSetup.map((item) => (
          <SelectItem value={item.type} key={item.id} className="cursor-pointer">
            {item.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
