import { DAY, WEEK } from "./dayRanges";

export const TSCO = "TSCO.LON";
export const IBM = "IBM";

export const symbolDataDefaultRange = {
  "TSCO.LON": WEEK,
  IBM: DAY,
};

export const fetchConfig = {
  IBM: {
    symbol: IBM,
    method: "TIME_SERIES_INTRADAY",
    apikey: "demo",
    interval: "5min",
    outputsize: "full",
  },
  "TSCO.LON": {
    symbol: TSCO,
    method: "TIME_SERIES_DAILY",
    apikey: "demo",
    interval: null,
    outputsize: "full",
  },
};
