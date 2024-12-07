export const getFormattedDate = (date: string, format: object) => {
  const newDate = new Date(date);
  const formatter = new Intl.DateTimeFormat('en', format);

  return formatter.format(newDate);
};
