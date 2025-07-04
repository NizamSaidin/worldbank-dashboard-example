import type { GraphDataApiResponse } from "../models/graph-data";

interface FetchGraphData {
  timeRange?: number[];
  time?: number;
  countries: string[];
  indicatorType: string;
}

export const fetchGraphData = async ({
  timeRange,
  countries,
  indicatorType,
}: FetchGraphData): Promise<GraphDataApiResponse> => {
  let url = `https://api.worldbank.org/v2/country/${countries.join(
    ";"
  )}/indicator/${indicatorType}?format=json&per_page=500`;

  if (timeRange && timeRange.length === 2) {
    url += `&date=${timeRange[0]}:${timeRange[1]}`;
  } else if (timeRange && timeRange.length === 1) {
    url += `&date=${timeRange[0]}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!Array.isArray(data) || data.length < 2) {
    throw new Error("Invalid data format received from API");
  }

  return {
    paginationData: data[0],
    item: data[1],
  };
};
