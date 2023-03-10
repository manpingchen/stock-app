import { useEffect, useState, useRef, createContext, useCallback, useTransition } from "react";
import { fetchData, lastRefreshed } from "../api/fetchData";
import { datetimeFormatter, sortDatesAsc, subtractDays } from "../helpers/dateHandlers";
import { numberFormatter } from "../helpers/numberFormatter";
import DateRanger from "../components/DateRanger";
import Chart from "../components/Chart";
import Loading from "../components/LoadingIndicator";
import "./TimeSeriesChart.scss";
import { TSCO, IBM, fetchConfig, symbolDataDefaultRange } from "../config/symbols";
import { DAY, MAX } from "../config/dayRanges";

export const DateRangeContext = createContext({});

function TimeSeriesLineChart() {
  const [chartData, setChartData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [latestData, setLatestData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [dayRange, setDayRange] = useState({ start: null, end: null });
  const [isPending, startTransition] = useTransition();
  const [selectedRange, setSelectedRange] = useState(DAY);
  const [symbol, setSymbol] = useState(IBM);

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
      setChartData(null);

      const endDate = new Date(lastRefreshed);
      let startDate;

      if (range !== MAX) startDate = subtractDays(lastRefreshed, range);
      if (range === MAX) startDate = null;

      setDayRange({ start: startDate, end: endDate });
      getDateRangedData();
    },
    [getDateRangedData]
  );

  const handleUpdateSymbol = (value) => {
    setChartData(null);
    setSymbol(value);
  };

  useEffect(() => {
    const loadData = async () => {
      const { metaData, timeSeriesData } = await fetchData(fetchConfig[symbol]);

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

        const range = symbolDataDefaultRange[symbol];
        handleUpdateDayRange({ range });
      }
    };

    if (mounted) {
      setChartData(null);

      startTransition(() => {
        loadData();
      });
    }

    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, [symbol]);

  useEffect(() => {
    getDateRangedData();
  }, [getDateRangedData]);

  if (!metaData || !latestData) {
    return <Loading fullScreen={true} />;
  }

  return (
    <DateRangeContext.Provider
      value={{
        isPending,
        chartData,
        setChartData,
        metaData,
        selectedRange,
        setSelectedRange,
        dayRange,
        handleUpdateDayRange,
      }}
    >
      <header>
        <select
          className="symbol-select"
          onChange={(e) => handleUpdateSymbol(e.target.value)}
          value={symbol}
          disabled={isPending}
        >
          <option value={IBM}>IBM (Intrady)</option>
          <option value={TSCO}>TSCO.LON (Daily)</option>
        </select>
      </header>
      <main>
        <section className="intro">
          <h2>{metaData.symbol}</h2>
          <h3>{latestData.close}</h3>
          <h6>{latestData.dateTime}</h6>
          <h6>{metaData.information}</h6>
        </section>
        <section className="chart">
          <DateRanger />
          {isPending || !chartData ? <Loading /> : <Chart />}
        </section>
        <section className="highlight">
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
      </main>
    </DateRangeContext.Provider>
  );
}

export default TimeSeriesLineChart;
