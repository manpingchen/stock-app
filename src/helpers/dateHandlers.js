import { DAY, WEEK, MONTH, MAX } from "../config/dayRanges";

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
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  config = showTimeZoneName
    ? { ...config, timeZone, timeZoneName: "longOffset" }
    : { ...config, timeZone };

  // to be improved, getting GMT from timezone
  const dateObj = new Date(`${date} GMT-05:00`);
  const dateTime = new Intl.DateTimeFormat("en-US", config).format(dateObj);
  return dateTime;
};
