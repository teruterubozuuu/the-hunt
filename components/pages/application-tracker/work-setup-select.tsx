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

type WorkSetupSelectProps = {
  defaultValue?:string;
}

export default function WorkSetupSelect({defaultValue}: WorkSetupSelectProps) {
  const items = workSetup.map((item) => ({ value: item.id, label: item.type }));

    const [value, setValue] = useState(defaultValue ?? workSetup[0].id);
    
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
          <SelectItem value={item.id} key={item.id} className="cursor-pointer">
            {item.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
