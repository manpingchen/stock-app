import axios from "axios";

export let lastRefreshed;
export let metaDataTimeZone;

// ref: https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo
// Response Format:
// {
//   "Meta Data": {
//     "1. Information": "Intraday (5min) open, high, low, close prices and volume",
//     "2. Symbol": "IBM",
//     "3. Last Refreshed": "2023-01-13 16:30:00",
//     "4. Interval": "5min",
//     "5. Output Size": "Full size",
//     "6. Time Zone": "US/Eastern",
//   },
//   "Time Series (5min)": {
//     "2023-01-13 16:30:00": {
//       "1. open": "145.6000",
//       "2. high": "145.6000",
//       "3. low": "145.6000",
//       "4. close": "145.6000",
//       "5. volume": "223",
//     },
//     "2023-01-13 16:15:00": {
//       "1. open": "145.8900",
//       "2. high": "145.8900",
//       "3. low": "145.8900",
//       "4. close": "145.8900",
//       "5. volume": "5928",
//     },
//   },
// };

export const fetchData = async ({ method, symbol, apikey, interval, outputsize }) => {
  try {
    const baseUrl = "https://www.alphavantage.co/query";
    const response = await axios.get(baseUrl, {
      params: {
        function: method,
        symbol,
        interval,
        outputsize,
        apikey,
      },
    });

    const data = await response.data;

    const timeSeriesData = Object.values(data)[1];
    const metaDataValue = Object.values(data)[0];

    const metaData = {
      information: metaDataValue["1. Information"],
      symbol: metaDataValue["2. Symbol"],
      timeZone: metaDataTimeZone,
      lastRefreshed,
      daily: !interval,
    };

    metaDataTimeZone = metaDataValue["6. Time Zone"];
    lastRefreshed = metaDataValue["3. Last Refreshed"];

    return { metaData, timeSeriesData };
  } catch (error) {
    return console.log("fetchData", { error });
  }
};
