import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card
          key={i}
          className="w-full md:max-w-xs md:h-200 flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-0 p-4 md:p-0"
        >
          <Skeleton className="h-16 w-16 md:hidden rounded-md shrink-0" />
          <div className="flex-1 md:contents">
            <CardHeader className="md:p-6 p-0">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="hidden md:block h-full">
              <Skeleton className="aspect-video w-full h-full" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
