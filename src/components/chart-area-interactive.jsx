import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useDashboard } from "@/context/DashboardContext";

// Labels and colors used by the chart.
const chartConfig = {
  created: {
    label: "Created Tickets",
    color: "var(--primary)",
  },
  resolved: {
    label: "Resolved Tickets",
    color: "var(--chart-2)",
  },
};

// Convert a Date into a local YYYY-MM-DD string.
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Format a YYYY-MM-DD string without UTC timezone shifting.
const formatChartDate = (value, includeYear = false) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear && { year: "numeric" }),
  });
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();

  const { tickets, loading, error } = useDashboard();

  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Calculate ticket activity from actual backend data.
  const filteredData = React.useMemo(() => {
    const daysToShow = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }[timeRange];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chartData = [];

    // Create one entry for every day in the selected range.
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      chartData.push({
        date: getDateKey(date),
        created: 0,
        resolved: 0,
      });
    }

    // Create a quick lookup for each date.
    const dateLookup = new Map(chartData.map((item) => [item.date, item]));

    // Count tickets by their creation and resolution dates.
    tickets.forEach((ticket) => {
      const createdDate = getDateKey(new Date(ticket.createdAt));
      const createdEntry = dateLookup.get(createdDate);

      if (createdEntry) {
        createdEntry.created += 1;
      }

      if (ticket.resolvedAt) {
        const resolvedDate = getDateKey(new Date(ticket.resolvedAt));
        const resolvedEntry = dateLookup.get(resolvedDate);

        if (resolvedEntry) {
          resolvedEntry.resolved += 1;
        }
      }
    });

    return chartData;
  }, [tickets, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Ticket Activity</CardTitle>

        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tickets created and resolved over time
          </span>

          <span className="@[540px]/card:hidden">Ticket activity</span>
        </CardDescription>

        <CardAction>
          <ToggleGroup
            multiple={false}
            value={timeRange ? [timeRange] : []}
            onValueChange={(value) => {
              setTimeRange(value[0] ?? "90d");
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>

            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>

            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Loading ticket activity...
          </div>
        ) : error ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-destructive">
            Failed to load ticket activity.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--color-created)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-resolved)"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--color-resolved)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => formatChartDate(value)}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatChartDate(value, true)}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="resolved"
                type="natural"
                fill="url(#fillResolved)"
                stroke="var(--color-resolved)"
              />

              <Area
                dataKey="created"
                type="natural"
                fill="url(#fillCreated)"
                stroke="var(--color-created)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
