export const sortDatesAsc = (key) => (a, b) => {
  return new Date(a[key]) - new Date(b[key]);
};

export const subtractDays = (date, days) => {
  const duplicatedDate = new Date(date);
  duplicatedDate.setDate(duplicatedDate.getDate() - days);
  const newDate = new Date(duplicatedDate);
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
