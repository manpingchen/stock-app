export const subtractDays = (date, days) => {
  const duplicatedDate = new Date(date);
  duplicatedDate.setDate(duplicatedDate.getDate() - days);
  const newDate = new Date(duplicatedDate);
  return newDate;
};
