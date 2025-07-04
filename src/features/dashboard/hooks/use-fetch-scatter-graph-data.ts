import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetch-graph-data";
import type { GraphDataApiResponse } from "../models/graph-data";

interface useFetchGraphDataProps {
  timeRange?: number[];
  countries: string[];
  indicatorTypes: string[];
}

export const useFetchScatterGraphData = ({
  timeRange,
  countries,
  indicatorTypes,
}: useFetchGraphDataProps) => {
  const gdp = useQuery<GraphDataApiResponse, Error>({
    enabled: !!indicatorTypes[0] && countries.length > 0,
    queryKey: ["graph-data", timeRange, countries, indicatorTypes[0]],
    queryFn: () =>
      fetchGraphData({
        timeRange,
        countries,
        indicatorType: indicatorTypes[0]!,
      }),
  });

  const exportData = useQuery<GraphDataApiResponse, Error>({
    enabled: !!indicatorTypes[1] && countries.length > 0,
    queryKey: ["graph-data", timeRange, countries, indicatorTypes[1]],
    queryFn: () =>
      fetchGraphData({
        timeRange,
        countries,
        indicatorType: indicatorTypes[1]!,
      }),
  });

  const population = useQuery<GraphDataApiResponse, Error>({
    enabled: !!indicatorTypes[2] && countries.length > 0,
    queryKey: ["graph-data", timeRange, countries, indicatorTypes[2]],
    queryFn: () =>
      fetchGraphData({
        timeRange,
        countries,
        indicatorType: indicatorTypes[2]!,
      }),
  });

  return { gdp, exportData, population };
};
