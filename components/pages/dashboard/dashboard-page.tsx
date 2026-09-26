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
import StatCards from "./stat-cards";
import StatusBreakdown from "./status-breakdown";
import ApplicationsOverTime from "./applications-over-time";
import ActivityFeed from "./activity-feed";
import InterviewSchedule from "./interview-schedule";
import { ActivityFeedProps } from "@/lib/types/activity-feed";

type JobEntry = {
  id: string;
  job_title: string;
  company_name: string;
  status: "to-apply" | "applied" | "interview" | "offer" | "closed";
  applied_at?: string;
  interview_at?: string;
};

type DashboardPageProps = {
  data: JobEntry[];
  activityData: ActivityFeedProps[];
};

export default function DashboardPage({ data, activityData }: DashboardPageProps) {
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
        <StatCards filteredData={filteredData} />
      </section>

      <section>
        <div className="flex md:flex-row flex-col gap-3">
          <ApplicationsOverTime
            lineChartConfig={lineChartConfig}
            lineChartData={lineChartData}
          />
          <StatusBreakdown
            pieChartConfig={pieChartConfig}
            pieChartData={pieChartData}
          />
        </div>
      </section>

      <section>
        <div className="flex md:flex-row flex-col gap-3 max-h-100">
          <ActivityFeed activityData={activityData}/>
          <InterviewSchedule
            jobs={data.filter(
              (job) => job.status === "interview" && Boolean(job.interview_at),
            )}
          />
        </div>
      </section>
    </div>
  );
}
