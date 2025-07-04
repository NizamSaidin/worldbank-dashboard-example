import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ASEAN_COUNTRIES_ISO2 } from "@/constants/global";
import Plot from "react-plotly.js";
import { useFetchScatterGraphData } from "../../hooks/use-fetch-scatter-graph-data";

export const ScatterPlotGraphCard = () => {
  const { gdp, exportData, population } = useFetchScatterGraphData({
    timeRange: [2011, 2021],
    countries: ASEAN_COUNTRIES_ISO2,
    indicatorTypes: [
      "NY.GDP.PCAP.CD", // GDP per capita
      "NE.EXP.GNFS.ZS", // Export of goods and services (% of GDP)
      "SP.POP.TOTL", // Population, total
    ],
  });

  const isLoading =
    gdp.isLoading || exportData.isLoading || population.isLoading;

  const isError = gdp.isError || exportData.isError || population.isError;

  const isEmpty =
    (gdp?.data?.item?.length || 0) === 0 ||
    (exportData?.data?.item?.length || 0) === 0 ||
    (population?.data?.item?.length || 0) === 0;

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (isError) return <div className="text-red-600">Failed to fetch data</div>;
  if (isEmpty) return <div className="text-center p-4">No data available</div>;

  const mapByCountryYear = (data: any[]) =>
    data.reduce((acc, item) => {
      const key = `${item.country.id}-${item.date}`;
      if (!acc[key])
        acc[key] = { country: item.country.value, year: item.date };
      acc[key].value = item.value;
      return acc;
    }, {} as Record<string, any>);

  const gdpMap = mapByCountryYear(gdp.data!.item);
  const exportMap = mapByCountryYear(exportData.data!.item);
  const popMap = mapByCountryYear(population.data!.item);

  const combined = Object.keys(gdpMap).map((key) => ({
    country: gdpMap[key].country,
    year: gdpMap[key].year,
    gdp: gdpMap[key]?.value,
    export: exportMap[key]?.value,
    population: popMap[key]?.value,
  }));

  const filtered = combined.filter((d) => d.gdp && d.export && d.population);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Export of goods and services (%of GDP) vs GDP per capita (current
          USD$)
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          From 2011 - 2021 (ASEAN Countries)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center h-full">
        <Plot
          data={[
            {
              x: filtered.map((d) => d.gdp),
              y: filtered.map((d) => d.export),
              text: filtered.map((d) => `${d.country} (${d.year})`),
              mode: "markers",
              type: "scatter",
              marker: {
                size: filtered.map((d) => Math.sqrt(d.population) / 1000),
                color: filtered.map((d) => parseInt(d.year)),
                colorscale: "Viridis",
                showscale: true,
                sizemode: "area",
                sizeref:
                  (2.0 * Math.max(...filtered.map((d) => d.population))) /
                  100 ** 2,
                sizemin: 4,
              },
              hovertemplate:
                "%{text}<br>GDP per capita: %{x:$,.0f}<br>Export: %{y:.1f}%<extra></extra>",
            },
          ]}
          layout={{
            xaxis: {
              title: {
                text: "GDP per capita (USD)",
              },
              type: "log",
            },
            yaxis: {
              title: {
                text: "Export of goods and services (% of GDP)",
              },
            },
            margin: { t: 50, l: 60, r: 20, b: 60 },
            hovermode: "closest",
          }}
          config={{ responsive: true }}
          style={{ width: "100%", height: 600 }}
        />
      </CardContent>
    </Card>
  );
};
