import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface LineChartData {
  date: string;
  applications: number;
}

interface ApplicationsOverTimeProps {
  lineChartData: LineChartData[];
  lineChartConfig: {
    applications: {
      label: string;
      color: string;
    };
  };
}

export default function ApplicationsOverTime({
  lineChartConfig,
  lineChartData,
}: ApplicationsOverTimeProps) {
  return (
    <Card className="border-2 border-foreground flex-2">
      <CardHeader>
        <CardTitle className="font-bold">Applications</CardTitle>
        <CardContent>
          <ChartContainer
            config={lineChartConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <LineChart data={lineChartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(date) =>
                  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      new Date(`${label}T00:00:00`).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    }
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="applications"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
