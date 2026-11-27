import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartStyle,
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

import { useDashboard } from "@/context/DashboardContext";

// Chart labels and colors.
const chartConfig = {
  count: {
    label: "Tickets",
  },
  low: {
    label: "Low",
    color: "var(--chart-2)",
  },
  medium: {
    label: "Medium",
    color: "var(--chart-3)",
  },
  high: {
    label: "High",
    color: "var(--chart-4)",
  },
  urgent: {
    label: "Urgent",
    color: "var(--chart-5)",
  },
};

export function TicketPriorityChart() {
  const id = "ticket-priority-chart";

  const { tickets, loading, error } = useDashboard();

  // Calculate ticket counts for each priority.
  const priorityData = React.useMemo(() => {
    const priorities = ["low", "medium", "high", "urgent"];

    return priorities.map((priority) => ({
      priority,
      count: tickets.filter((ticket) => ticket.priority === priority).length,
      fill: `var(--color-${priority})`,
    }));
  }, [tickets]);

  const [activePriority, setActivePriority] = React.useState("low");

  // Find the index of the currently selected priority.
  const activeIndex = React.useMemo(
    () => priorityData.findIndex((item) => item.priority === activePriority),
    [priorityData, activePriority],
  );

  // Get all available priority names.
  const priorities = React.useMemo(
    () => priorityData.map((item) => item.priority),
    [priorityData],
  );

  // Get the currently selected priority's data.
  const activeItem = priorityData[activeIndex] ?? priorityData[0];

  // Highlight the selected section of the donut chart.
  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector {...props} outerRadius={outerRadius + 10} />

            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        );
      }

      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority</CardTitle>
          <CardDescription>
            Unable to load ticket priority data.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Ticket Priority</CardTitle>

          <CardDescription>Distribution of tickets by priority</CardDescription>
        </div>

        <Select
          value={activePriority}
          onValueChange={(value) => {
            if (value !== null) {
              setActivePriority(value);
            }
          }}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select ticket priority"
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>

          <SelectContent align="end" className="rounded-xl">
            {priorities.map((key) => {
              const config = chartConfig[key];

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />

                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        {loading ? (
          <div className="flex aspect-square w-full max-w-[300px] items-center justify-center text-sm text-muted-foreground">
            Loading priority data...
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex aspect-square w-full max-w-[300px] items-center justify-center text-sm text-muted-foreground">
            No ticket data available.
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={priorityData}
                dataKey="count"
                nameKey="priority"
                innerRadius={60}
                strokeWidth={5}
                shape={renderPieShape}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {activeItem.count.toLocaleString()}
                          </tspan>

                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {activeItem.priority.charAt(0).toUpperCase() +
                              activeItem.priority.slice(1)}
                          </tspan>
                        </text>
                      );
                    }

                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
