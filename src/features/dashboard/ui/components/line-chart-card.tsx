import { AlertCircle } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartToggleLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IndicatorDropdown } from "@/components/ui/indicator-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ASEAN_COUNTRIES_ISO2,
  DEFAULT_TIME_RANGE,
  type IndicatorType,
} from "@/constants/global";
import { useState } from "react";
import { useFetchGraphData } from "../../hooks/use-fetch-graph-data";
import type { CountryData, DataItem } from "../../models/graph-data";
import { getChartConfig, getCountries } from "../../utils/chart-utils";

// Transform API data to chart format
const transformData = (data: DataItem[]) => {
  if (!data || data.length === 0) return [];

  // Group data by year
  const groupedByYear = data.reduce((acc, item) => {
    const year = parseInt(item.date);
    const country = item.country.id;
    const value = item.value;

    if (!acc[year]) {
      acc[year] = { year: year.toString() };
    }

    acc[year][country] = value;

    return acc;
  }, {} as Record<number, any>);

  return Object.values(groupedByYear).sort((a: any, b: any) => a.year - b.year);
};

// Calculate Y-axis domain to handle negative values
const calculateYDomain = (data: any[], countries: CountryData[]) => {
  if (!data || data.length === 0 || countries.length === 0) return [0, 100];

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  data.forEach((item) => {
    countries.forEach((country) => {
      const value = item[country.id];
      if (typeof value === "number" && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
  });

  // Add 10% padding
  const padding = Math.abs(max - min) * 0.1;
  return [min - padding, max + padding];
};

const LineChartCardComponent = ({ data }: { data: DataItem[] }) => {
  const chartData = transformData(data);
  const countries = getCountries(data);
  const chartConfig = getChartConfig(countries);

  const yDomain = calculateYDomain(chartData, countries);

  const [visibleCountries, setVisibleCountries] = useState<
    {
      id: string;
      visible: boolean;
    }[]
  >(
    countries.map((country) => ({
      id: country.id,
      visible: true,
    }))
  );

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between">
      <ChartContainer config={chartConfig} className="min-h-[350px] flex-1">
        <RechartsLineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            interval={0}
            tickFormatter={(value) => value.toString()}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={yDomain}
            tickFormatter={(value) => {
              if (Math.abs(value) >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
              }
              return value.toFixed(1);
            }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          {countries.map((country) => {
            if (
              visibleCountries.find((c) => c.id === country.id)?.visible ===
              false
            ) {
              return null;
            }

            return (
              <Line
                key={country.id}
                dataKey={country.id}
                type="monotone"
                stroke={`var(--color-${country.id})`}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            );
          })}
        </RechartsLineChart>
      </ChartContainer>
      <ChartToggleLegend
        payload={countries}
        chartConfig={chartConfig}
        visibleLegend={visibleCountries}
        onToggle={(value) => {
          setVisibleCountries((prev) =>
            prev.map((country) =>
              country.id === value
                ? { ...country, visible: !country.visible }
                : country
            )
          );
        }}
      />
    </div>
  );
};

const LineChartSkeleton = () => (
  <div className="flex flex-col gap-4 items-center justify-center h-[350px] w-full">
    <Skeleton className="h-full w-full flex-1" />
    <div className="flex gap-4 items-center justify-center">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-20" />
      ))}
    </div>
  </div>
);

const LineChartError = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error.message || "Failed to load chart data. Please try again."}
    </AlertDescription>
  </Alert>
);

const LineChartContent = ({
  data,
  isLoading,
  error,
}: {
  data: DataItem[] | undefined | null;
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return <LineChartSkeleton />;
  }

  if (error) {
    return <LineChartError error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No chart data to display</p>
      </div>
    );
  }

  return <LineChartCardComponent data={data} />;
};

export const LineChartCard = () => {
  const [indicatorTypeValue, setIndicatorTypeValue] =
    useState<IndicatorType | null>("BX.KLT.DINV.WD.GD.ZS");

  const { data, isLoading, error } = useFetchGraphData({
    countries: ASEAN_COUNTRIES_ISO2,
    indicatorType: indicatorTypeValue,
    timeRange: DEFAULT_TIME_RANGE,
  });

  return (
    <Card className="h-full w-full">
      <CardHeader className="xl:min-w-[450px] w-full xl:w-min">
        <IndicatorDropdown
          value={indicatorTypeValue}
          onChange={setIndicatorTypeValue}
        />
      </CardHeader>
      <CardContent className="min-h-[500px] flex-1 flex flex-col items-center justify-center h-full">
        <LineChartContent
          data={data?.item}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
};
