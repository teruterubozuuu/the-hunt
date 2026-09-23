"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CalculatorIcon,
  ChartLineIcon,
  MoneyIcon,
  PulseIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

type JobEntry = {
  id: string;
  status: "to-apply" | "applied" | "interview" | "offer" | "closed";
  applied_at?: string;
};

type DashboardPageProps = {
  data: JobEntry[];
};

export default function DashboardPage({ data }: DashboardPageProps) {
  /**
   * Filters data to get their respective lengths
   * and overall response rate
   */

  const totalApplications = data.filter(
    (item) =>
      item.status === "applied" ||
      item.status === "interview" ||
      item.status === "offer",
  ).length;

  const activeApplications = data.filter(
    (applied) => applied.status === "applied",
  ).length;

  const totalInterview = data.filter(
    (interview) => interview.status === "interview",
  ).length;

  const totalOffers = data.filter((offers) => offers.status === "offer").length;

  const responseRate =
    totalApplications > 0
      ? ((totalInterview / activeApplications) * 100).toFixed(0)
      : "0";

  const filteredData = [
    {
      id: "Total Applications",
      data: totalApplications,
      icon: <CalculatorIcon />,
    },
    {
      id: "Active Applications",
      data: activeApplications,
      icon: <PulseIcon />,
    },
    { id: "Interviews Scheduled", data: totalInterview, icon: <UsersIcon /> },
    { id: "Offers Received", data: totalOffers, icon: <MoneyIcon /> },
    {
      id: "Response Rate",
      data: ` ${responseRate} %`,
      icon: <ChartLineIcon />,
    },
  ];

  /**
   * Extract applications per date
   */
  const applicationsPerDate = data
    .filter((entry): entry is JobEntry & { applied_at: string } =>
      Boolean(entry.applied_at),
    )
    .reduce<Record<string, number>>((counts, entry) => {
      const date = entry.applied_at.slice(0, 10);
      counts[date] = (counts[date] ?? 0) + 1;
      return counts;
    }, {});

  /**
   * Chart Data
   */

  const lineChartData = Object.entries(applicationsPerDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, applications]) => ({
      date,
      applications,
    }));

  const lineChartConfig = {
    applications: {
      label: "Applications",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const pieChartData = [
    {
      status: "to-apply",
      applicationCount: data.filter((d) => d.status === "to-apply").length,
      fill: "var(--chart-1)",
    },
    {
      status: "applied",
      applicationCount: data.filter((d) => d.status === "applied").length,
      fill: "var(--chart-2)",
    },
    {
      status: "interview",
      applicationCount: data.filter((d) => d.status === "interview").length,
      fill: "var(--chart-3)",
    },
    {
      status: "offer",
      applicationCount: data.filter((d) => d.status === "offer").length,
      fill: "var(--chart-4)",
    },
    {
      status: "closed",
      applicationCount: data.filter((d) => d.status === "closed").length,
      fill: "var(--chart-5)",
    },
  ];

  const pieChartConfig = {
    applicationCount: {
      label: "Entries",
    },
    "to-apply": {
      label: "To Apply",
      color: "var(--chart-1)",
    },
    applied: {
      label: "Applied",
      color: "var(--chart-2)",
    },
    interview: {
      label: "Interview",
      color: "var(--chart-3)",
    },
    offer: {
      label: "Offer",
      color: "var(--chart-4)",
    },
    closed: {
      label: "Closed",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      {/**
       * Top-line Stat Cards
       */}
      <section className="grid md:grid-cols-5 grid-cols-2 gap-3">
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
      </section>

      <section>
        <div className="flex md:flex-row flex-col gap-3">
          <Card className="border-2 border-foreground flex-2">
            <CardHeader>
              <CardTitle className="font-bold">Applications</CardTitle>
              <CardContent>
                <ChartContainer config={lineChartConfig}           className="aspect-auto h-62.5 w-full"
>
                  <LineChart data={lineChartData}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(date) =>
                        new Date(`${date}T00:00:00`).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )
                      }
                    />

                    <ChartTooltip content={
                      <ChartTooltipContent 
                        labelFormatter={(label)=>
                          new Date(`${label}T00:00:00`).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
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
                      <ChartTooltipContent
                        nameKey="applicationCount"
                        hideLabel
                      />
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
        </div>
      </section>
    </div>
  );
}
