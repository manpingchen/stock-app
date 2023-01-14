import { useCallback, useEffect, useState, useRef } from "react";
import { sortDatesAsc } from "../helpers/sortDates";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { subtractDays } from "../helpers/subtractDays";
import { fetchData } from "../api/fetchData";

function TimeSeriesLineChart() {
  const [chartData, setChartData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [dayRange, setDayRange] = useState({
    start: null,
    end: null,
  });

  const mounted = useRef(false);
  const { start, end } = dayRange;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="value">{`${payload[0].value}`}</p>
          <p className="des">Volume ({`${payload[0].payload["5. volume"]}`})</p>
        </div>
      );
    }

    return null;
  };

  const handleUpdateDayRange = ({ endDate = dayRange.end, range = "1day" }) => {
    let startDate;

    if (range === "1day") {
      startDate = subtractDays(endDate, 1);
    }
    if (range === "7days") {
      startDate = subtractDays(endDate, 7);
    }
    if (range === "1month") {
      startDate = subtractDays(endDate, 7);
    }
    setDayRange({ start: startDate, end: endDate });
  };

  useEffect(() => {
    const loadData = async () => {
      console.log("loadData");
      
      const { metaData, timeSeriesData } = await fetchData();
      
      if (metaData && timeSeriesData) {
        setMetaData(metaData);
        setTimeSeriesData(timeSeriesData);

        const { lastRefreshed } = metaData;
        const endDate = new Date(lastRefreshed);
        setDayRange({ start: subtractDays(endDate, 1), end: endDate });
      }
    };

    if (mounted) {
      loadData();
    }

    mounted.current = true;
    return () => {
      mounted.current = false
    };
  }, []);

  useEffect(() => {
    if (timeSeriesData) {
      // Form Date-Ranged Data

      const dateRangedData = [];

      for (const [key, value] of Object.entries(timeSeriesData)) {

        const dataDate = new Date(key);
        if (dataDate >= start && dataDate <= end) {
          dateRangedData.push({ name: key, ...value });
          dateRangedData.sort(sortDatesAsc("name"));
        }

      }

      setChartData(dateRangedData);
    }
  }, [timeSeriesData, start]);

  if (chartData === null) {
    return "loading";
  }

  return (
    <main>
      <div>
        <h2>{metaData.symbol}</h2>
        <h3>{chartData[chartData.length - 1]["4. close"]}</h3>
        <p>Last Refreshed: {metaData.lastRefreshed} </p>
      </div>
      <div className="day-ranger-buttons">
        <button type="button" onClick={() => handleUpdateDayRange({ range: "1day" })}>
          1 Day
        </button>
        <button type="button" onClick={() => handleUpdateDayRange({ range: "7days" })}>
          7 Days
        </button>
        <button type="button" onClick={() => handleUpdateDayRange({ range: "1month" })}>
          1 Month
        </button>
      </div>
      <ResponsiveContainer aspect={16.0 / 9.0}>
        <LineChart
          width={400}
          height={400}
          data={chartData}
        >
          <Line dataKey="4. close" stroke="pink" activeDot={{ r: 3 }} />
          <XAxis dataKey="name" />
          <YAxis
            dataKey="4. close"
            height={100}
            domain={[
              (dataMin) => parseFloat(dataMin).toFixed(2),
              (dataMax) => parseFloat(dataMax).toFixed(2),
            ]}
            type="number"
            allowDataOverflow={true}
            tickSize={7}
          />
          <Tooltip content={CustomTooltip} />
          <CartesianGrid strokeDasharray="1 3" />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
}

export default TimeSeriesLineChart;
