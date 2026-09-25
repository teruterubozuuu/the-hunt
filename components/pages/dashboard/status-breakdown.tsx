import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Pie, PieChart } from "recharts";

interface PieChartData {
  status: string;
  applicationCount: number;
  fill: string;
}

interface StatusBreakdownProps {
  pieChartData: PieChartData[];
  pieChartConfig: {
    applicationCount: {
      label: string;
    };
    "to-apply": {
      label: string;
      color: string;
    };
    applied: {
      label: string;
      color: string;
    };
    interview: {
      label: string;
      color: string;
    };
    offer: {
      label: string;
      color: string;
    };
    closed: {
      label: string;
      color: string;
    };
  };
}

export default function StatusBreakdown({
  pieChartConfig,
  pieChartData,
}: StatusBreakdownProps) {
  return (
    <Card className="border-2 border-foreground flex-1">
      <CardHeader>
        <CardTitle className="font-bold">Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieChartConfig} className="mx-auto">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent nameKey="applicationCount" hideLabel />
              }
            />
            <Pie data={pieChartData} dataKey="applicationCount" />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
