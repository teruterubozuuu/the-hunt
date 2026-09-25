import { Card, CardContent } from "@/components/ui/card";
import React, { JSX } from "react";

interface StatData {
  id: string;
  data: string | number;
  icon: JSX.Element;
}

interface StatDataProps {
  filteredData: StatData[];
}

export default function StatCards({ filteredData }: StatDataProps) {
  return (
    <>
      {filteredData.map((item) => (
        <Card key={item.id} className="border-2 border-foreground">
          <CardContent className="flex justify-between items-center">
            <div className="space-y-2">
              <h2 className="md:text-md text-xs text-muted-foreground font-medium">
                {item.id}
              </h2>
              <h3 className="md:text-lg font-bold">{item.data}</h3>
            </div>
            <span className="md:text-3xl text-xl">{item.icon}</span>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
