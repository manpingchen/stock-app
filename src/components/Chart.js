import { useContext } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer, CartesianGrid, XAxis, Tooltip } from "recharts";
import CustomAxisTick from "../components/CustomAxisTick";
import CustomTooltip from "../components/CustomTooltip";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import "./Chart.scss";

function Chart() {
  const { chartData } = useContext(DateRangeContext);

  return (
    <ResponsiveContainer aspect={16.0 / 9.0}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <Line
          type="natural"
          dataKey="4. close"
          strokeWidth={2}
          stroke="#129d48"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Tooltip content={({active, payload})=><CustomTooltip data={payload} active={active} />} />
        <XAxis
          allowDataOverflow
          interval="preserveStartEnd"
          allowDuplicatedCategory={false}
          dataKey="name"
          tickSize={0}
          tick={<CustomAxisTick />}
        />
        <YAxis
          dataKey="4. close"
          allowDataOverflow
          fontSize={10}
          domain={[
            (dataMin) => parseFloat(dataMin).toFixed(2),
            (dataMax) => parseFloat(dataMax).toFixed(2),
          ]}
          type="number"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
