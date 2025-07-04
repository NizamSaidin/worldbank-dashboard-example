import { BarChartCard } from "../components/bar-chart-card";
import { LineChartCard } from "../components/line-chart-card";
import { MapView } from "../components/map-view";
import { ScatterPlotGraphCard } from "../components/scatter-plot-graph-card";

export const GraphSection = () => {
  return (
    <div className="grid grid-cols-12 gap-6 p-4">
      <div className="col-span-12">
        <h2 className="text-2xl font-bold mb-4">Worldbank Dashboard</h2>
        <p className="text-muted-foreground">
          Explore various data visualizations to gain insights into the
          indicators and trends.
        </p>
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <LineChartCard />
      </div>

      <div className="col-span-12 lg:col-span-12  lg:order-3 xl:order-2 xl:col-span-4">
        <BarChartCard />
      </div>

      <div className="col-span-12 lg:col-span-6 lg:order-2 xl:order-3 xl:col-span-4">
        <MapView />
      </div>

      <div className="col-span-12 order-4">
        <ScatterPlotGraphCard />
      </div>
    </div>
  );
};
