import axios from "axios";

export let lastRefreshed;

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
      timeZone: metaDataValue["6. Time Zone"],
      lastRefreshed,
      daily: !interval,
    };

    lastRefreshed = metaDataValue["3. Last Refreshed"];

    return { metaData, timeSeriesData };
  } catch (error) {
    return console.log("fetchData", { error });
  }
};
