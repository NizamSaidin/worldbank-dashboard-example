import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IndicatorDropdown } from "@/components/ui/indicator-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRangeSelector } from "@/components/ui/time-range-selector";
import { ASEAN_COUNTRIES_ISO2, type IndicatorType } from "@/constants/global";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useFetchGraphData } from "../../hooks/use-fetch-graph-data";
import type { DataItem } from "../../models/graph-data";
import { getChartConfig, getCountries } from "../../utils/chart-utils";

// Transform API data to chart format
function transformData(data: DataItem[]) {
  const summary: Record<string, { label: string; sum: number; count: number }> =
    {};

  data.forEach(({ country: { id, value: label }, value }) => {
    if (!summary[id]) {
      summary[id] = { sum: 0, count: 0, label };
    }
    summary[id].sum += value;
    summary[id].count += 1;
  });

  return Object.entries(summary)
    .map(([id, { sum, count, label }]) => ({
      id,
      label: label,
      average: sum / count,
    }))
    .sort((a, b) => b.average - a.average);
}

const BarChartComponent = ({ data }: { data: DataItem[] }) => {
  const chartData = transformData(data);
  const countries = getCountries(data);
  const chartConfig = getChartConfig(countries);

  return (
    <ChartContainer config={chartConfig} className="h-full xl:m-20">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -20,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <XAxis type="number" dataKey="average" hide />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          axisLine={false}
          width={100}
          fontSize={12}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="average" radius={[0, 6, 6, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartConfig[entry.id]?.color || "hsl(var(--chart-1))"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

const BarChartSkeleton = () => (
  <div className="flex flex-col w-full gap-4 items-center justify-center h-[350px]">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center gap-2 w-full">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

const BarChartError = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error.message || "Failed to load chart data. Please try again."}
    </AlertDescription>
  </Alert>
);

const BarChartContent = ({
  data,
  isLoading,
  error,
}: {
  data: DataItem[] | undefined | null;
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return <BarChartSkeleton />;
  }

  if (error) {
    return <BarChartError error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No chart data to display</p>
      </div>
    );
  }

  return <BarChartComponent data={data} />;
};

export const BarChartCard = () => {
  const [indicatorTypeValue, setIndicatorTypeValue] =
    useState<IndicatorType | null>("BX.KLT.DINV.WD.GD.ZS");
  const [timeRange, setTimeRange] = useState<number[]>([2011, 2021]);

  const { data, isLoading, error } = useFetchGraphData({
    countries: ASEAN_COUNTRIES_ISO2,
    indicatorType: indicatorTypeValue,
    timeRange,
  });

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="xl:min-w-[450px] w-full xl:w-min">
        <IndicatorDropdown
          value={indicatorTypeValue}
          onChange={setIndicatorTypeValue}
        />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center h-full">
        <BarChartContent
          data={data?.item}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
      <CardFooter>
        <TimeRangeSelector value={timeRange} onValueChange={setTimeRange} />
      </CardFooter>
    </Card>
  );
};
