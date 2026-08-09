import { Card, CardContent } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/react";
import React from "react";

export function KanbanContainer({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  const { ref } = useDroppable({ id });

  return (
    <Card ref={ref} className="flex-1 border-2 border-foreground flex flex-col md:max-h-190">
      <CardContent className="flex flex-col min-h-0 flex-1 overflow-y-auto">
        {children}
      </CardContent>
    </Card>
  );
}
