import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../api/fetch-graph-data";
import type { GraphDataApiResponse } from "../models/graph-data";

interface useFetchGraphDataProps {
  timeRange?: number[];
  countries: string[];
  indicatorType: string | null;
}

export const useFetchGraphData = ({
  timeRange,
  countries,
  indicatorType,
}: useFetchGraphDataProps) => {
  const query = useQuery<GraphDataApiResponse, Error>({
    enabled: !!indicatorType && countries.length > 0,
    queryKey: ["graph-data", timeRange, countries, indicatorType],
    queryFn: () =>
      fetchGraphData({ timeRange, countries, indicatorType: indicatorType! }),
  });
  return query;
};
