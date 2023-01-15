import { useEffect, useState, useRef, createContext, useCallback, useTransition } from "react";
import { sortDatesAsc } from "../helpers/sortDates";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { fetchData, lastRefreshed } from "../api/fetchData";
import DateRanger from "../components/DateRanger";
import { subtractDays } from "../helpers/subtractDays";
import CustomizedAxisTick from "../components/CustomizedAxisTick";

export const DateRangeContext = createContext({});

function TimeSeriesLineChart() {
  const [chartData, setChartData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [dayRange, setDayRange] = useState({ start: null, end: null });
  const [isPending, startTransition] = useTransition();
  const [selectedRange, setSelectedRange] = useState("1day");

  const mounted = useRef(false);
  const { start, end } = dayRange;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.name}</p>
          <p className="value">{payload[0].value}</p>
          <p className="des">Volume ({payload[0].payload["5. volume"]})</p>
        </div>
      );
    }

    return null;
  };

  const getDateRangedData = useCallback(() => {
    if (!timeSeriesData) return;

    startTransition(() => {
      const dateRangedData = [];

      for (const [key, value] of Object.entries(timeSeriesData)) {
        const dataDate = new Date(key);
        if ((start && dataDate > start && dataDate <= end) || (!start && dataDate <= end)) {
          dateRangedData.push({ name: key, ...value });
          dateRangedData.sort(sortDatesAsc("name"));
        }
      }

      console.log(dateRangedData[0]);
      setChartData(dateRangedData);
    });
  }, [timeSeriesData, start, end]);

  const handleUpdateDayRange = useCallback(
    ({ range }) => {
      console.log("handleUpdateDayRange", { range });
      const endDate = new Date(lastRefreshed);
      let startDate;

      switch (range) {
        case "7days":
          startDate = subtractDays(lastRefreshed, 7);
          break;
        case "1month":
          startDate = subtractDays(lastRefreshed, 30);
          break;
        case "all":
          startDate = null;
          break;
        case "1day":
        default:
          startDate = subtractDays(lastRefreshed, 1);
          break;
      }
      setDayRange({ start: startDate, end: endDate });
      getDateRangedData();
    },
    [getDateRangedData]
  );

  useEffect(() => {
    const loadData = async () => {
      console.log("loadData");

      const { metaData, timeSeriesData } = await fetchData();
      if (metaData && timeSeriesData) {
        setMetaData(metaData);
        setTimeSeriesData(timeSeriesData);
        handleUpdateDayRange({ range: "1day" });
      }
    };

    if (mounted) {
      loadData();
    }

    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    getDateRangedData();
  }, [getDateRangedData]);

  if (!chartData) {
    return "loading";
  }

  return (
    <DateRangeContext.Provider
      value={{ metaData, selectedRange, setSelectedRange, dayRange, handleUpdateDayRange }}
    >
      <main>
        <div>
          <h2>{metaData.symbol}</h2>
          <h3>{chartData[chartData.length - 1]["4. close"]}</h3>
          <p>Last Refreshed: {end.toISOString()} </p>
        </div>
        <DateRanger />

        {isPending ? (
          "pending"
        ) : (
          <ResponsiveContainer aspect={16.0 / 9.0}>
            <LineChart data={chartData}>
              <Line
                type="natural"
                dataKey="4. close"
                stroke="pink"
                dot={false}
                activeDot={{ r: 4 }}
              />
              <XAxis
                allowDataOverflow
                interval="preserveStartEnd"
                allowDuplicatedCategory={false}
                dataKey="name"
                tickSize={0}
                tick={<CustomizedAxisTick />}
              />
              <YAxis
                dataKey="4. close"
                allowDataOverflow
                domain={[
                  (dataMin) => parseFloat(dataMin).toFixed(2),
                  (dataMax) => parseFloat(dataMax).toFixed(2),
                ]}
                type="number"
              />
              <Tooltip content={CustomTooltip} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </main>
    </DateRangeContext.Provider>
  );
}

export default TimeSeriesLineChart;
