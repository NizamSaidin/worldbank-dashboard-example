import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IndicatorDropdown } from "@/components/ui/indicator-dropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeSelector } from "@/components/ui/time-slider-selector";
import { ASEAN_COUNTRIES_ISO2, type IndicatorType } from "@/constants/global";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import Plot from "react-plotly.js";
import { useFetchGraphData } from "../../hooks/use-fetch-graph-data";
import type { DataItem } from "../../models/graph-data";

export const MapViewComponent = ({ data }: { data: DataItem[] }) => {
  const locations = data.map((d) => d.countryiso3code);
  const z = data.map((d) => d.value);
  const customdata = data.map((d) => [d.country.value, d.date]);

  return (
    <Plot
      data={[
        {
          type: "choropleth",
          showscale: false,
          locationmode: "ISO-3",
          locations,
          z,
          customdata,
          hovertemplate:
            "%{customdata[0]}<br>" +
            "Year %{customdata[1]}<br>" +
            "Value %{z}<extra></extra>",
          marker: { line: { color: "white", width: 1 } },
        },
        {
          type: "scattergeo",
          mode: "text",
          locationmode: "ISO-3",
          locations,
          text: data.map((d) => d.country.value),
          textfont: { size: 12, color: "black" },
          hoverinfo: "none",
          showlegend: false,
        },
      ]}
      layout={{
        margin: { t: 0, b: 0, l: 0, r: 0 },
        geo: {
          fitbounds: "locations",
          projection: {
            type: "mercator",
            scale: 100, // Initial zoom scale
          },
          showframe: false,
          showcoastlines: false,
          bgcolor: "#c3e0e6",
          showland: true,
          landcolor: "#e8e8e8",
          showcountries: true,
          countrycolor: "white",
        },
      }}
      style={{ width: "100%", height: "500px", overflow: "hidden" }}
      config={{
        responsive: true,
        displayModeBar: false,
        scrollZoom: true,
      }}
    />
  );
};

const MapViewSkeleton = () => <Skeleton className="h-full w-full" />;

const MapViewError = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error.message || "Failed to load chart data. Please try again."}
    </AlertDescription>
  </Alert>
);

const MapViewContent = ({
  data,
  isLoading,
  error,
}: {
  data: DataItem[] | undefined | null;
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return <MapViewSkeleton />;
  }

  if (error) {
    return <MapViewError error={error} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No chart data to display</p>
      </div>
    );
  }

  return <MapViewComponent data={data} />;
};

export const MapView = () => {
  const [indicatorTypeValue, setIndicatorTypeValue] =
    useState<IndicatorType | null>("BX.KLT.DINV.WD.GD.ZS");
  const [timeSelectorValue, setTimeSelectorValue] = useState<number>(2021);

  const { data, isLoading, error } = useFetchGraphData({
    countries: ASEAN_COUNTRIES_ISO2,
    indicatorType: indicatorTypeValue,
    timeRange: [timeSelectorValue],
  });

  return (
    <Card className="h-full">
      <CardHeader className="xl:min-w-[450px] w-full xl:w-min">
        <IndicatorDropdown
          value={indicatorTypeValue}
          onChange={setIndicatorTypeValue}
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-start h-full">
        <MapViewContent data={data?.item} isLoading={isLoading} error={error} />
      </CardContent>
      <CardFooter>
        <TimeSelector
          value={timeSelectorValue}
          onValueChange={setTimeSelectorValue}
        />
      </CardFooter>
    </Card>
  );
};
