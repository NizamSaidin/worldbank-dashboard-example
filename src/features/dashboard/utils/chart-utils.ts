import type { ChartConfig } from "@/components/ui/chart";
import type { CountryData, DataItem } from "../models/graph-data";

export const getCountries = (data: DataItem[]) => {
  if (!data || data.length === 0) return [];

  // Extract unique country IDs from the data
  const countries = data.map((item) => item.country.id);
  return [...new Set(countries)].map((id) => ({
    id,
    value: data.find((item) => item.country.id === id)?.country.value,
  })) as CountryData[];
};

export const getChartConfig = (countries: CountryData[]): ChartConfig => {
  const config: ChartConfig = {};
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  countries.forEach((country, index) => {
    config[country.id] = {
      label: country.value,
      color: chartColors[index % chartColors.length],
    };
  });

  return config;
};
