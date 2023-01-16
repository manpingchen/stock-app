import { DAY, WEEK, MONTH } from "../config/dayRanges";
import { metaDataTimeZone } from "../api/fetchData";

export const sortDatesAsc = (key) => (a, b) => {
  return new Date(a[key]) - new Date(b[key]);
};

export const subtractDays = (date, range) => {
  let days;

  switch (range) {
    case WEEK:
      days = 7;
      break;
    case MONTH:
      days = 30;
      break;
    case DAY:
    default:
      days = 1;
      break;
  }

  const duplicatedDate = new Date(date);
  duplicatedDate.setDate(duplicatedDate.getDate() - days);

  // get the last min of the day
  const newDate = new Date(duplicatedDate).setHours(23, 59, 59, 999);
  return newDate;
};

export const datetimeFormatter = ({ date, config, showTimeZoneName = false }) => {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dataDate = new Date(date);
  const localeDate = new Date(dataDate.toLocaleString("default", { timeZone: metaDataTimeZone }));
  const diff = (localeDate - dataDate) / 36e5; // 36e5 = 60*60*1000 (hour)

  config = {
    ...config,
    timeZone: localTimeZone,
    timeZoneName: showTimeZoneName ? "shortOffset" : undefined,
  };

  const localeDateObj = new Date(`${dataDate} GMT${diff}`);
  const formattedLocaleDate = new Intl.DateTimeFormat("default", config).format(localeDateObj);
  return formattedLocaleDate;
};
