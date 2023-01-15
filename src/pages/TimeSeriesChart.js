import { useEffect, useState, useRef, createContext, useCallback, useTransition } from "react";
import { fetchData, lastRefreshed } from "../api/fetchData";
import { datetimeFormatter, sortDatesAsc, subtractDays } from "../helpers/dateHandlers";
import { numberFormatter } from "../helpers/numberFormatter";
import DateRanger from "../components/DateRanger";
import Chart from "../components/Chart";
import Loading from "../components/LoadingIndicator";
import "./TimeSeriesChart.scss";

export const DateRangeContext = createContext({});

function TimeSeriesLineChart() {
  const [chartData, setChartData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [latestData, setLatestData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [dayRange, setDayRange] = useState({ start: null, end: null });
  const [isPending, startTransition] = useTransition();
  const [selectedRange, setSelectedRange] = useState("1day");

  const mounted = useRef(false);
  const { start, end } = dayRange;

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
        case "max":
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

        const latestData = {
          open: numberFormatter(timeSeriesData[lastRefreshed]["1. open"]),
          high: numberFormatter(timeSeriesData[lastRefreshed]["2. high"]),
          low: numberFormatter(timeSeriesData[lastRefreshed]["3. low"]),
          close: numberFormatter(timeSeriesData[lastRefreshed]["4. close"]),
          volume: timeSeriesData[lastRefreshed]["5. volume"],
        };

        setLatestData({
          ...latestData,
          dateTime: datetimeFormatter({
            date: lastRefreshed,
            config: {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "numeric",
              
            },
            showTimeZoneName: true,
          }),
        });
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
    return <Loading fullScreen={true} />;
  }

  return (
    <DateRangeContext.Provider
      value={{
        chartData,
        metaData,
        selectedRange,
        setSelectedRange,
        dayRange,
        handleUpdateDayRange,
      }}
    >
      <main>
        <section className="highlight">
          <div className="highlight__intro">
            <h2>{metaData.symbol}</h2>
            <h3>{latestData.close}</h3>
            <h6>{latestData.dateTime}</h6>
          </div>
          <ul className="highlight__detail">
            <li>
              <span className="highlight__detail-title">Open</span>
              <span>{latestData.open}</span>
            </li>
            <li>
              <span className="highlight__detail-title">High</span>
              <span>{latestData.high}</span>
            </li>
            <li>
              <span className="highlight__detail-title">Low</span>
              <span>{latestData.low}</span>
            </li>
            <li>
              <span className="highlight__detail-title">Close</span>
              <span>{latestData.close}</span>
            </li>
            <li>
              <span className="highlight__detail-title">Volume</span>
              <span>{latestData.volume}</span>
            </li>
          </ul>
        </section>
        <section className="chart">
          <DateRanger />
          {isPending ? <Loading /> : <Chart />}
        </section>
      </main>
    </DateRangeContext.Provider>
  );
}

export default TimeSeriesLineChart;
