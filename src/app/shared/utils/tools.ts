/**
 * Converts a local date without time to a date with time in UTC format.
 * @param date The date in YYYY-MM-DD format.
 */
export const dateToUTCDate = (date: string): string => {
  // Convert date string to date
  const localDate = new Date(date);

  // Convert local date to UTC date using offset
  const utcDate = new Date(
    localDate.getTime() + localDate.getTimezoneOffset() * 60000
  ).toISOString();

  // Format UTC to YYYY-MM-DD HH:mm:ss format
  return utcDate.slice(0, 19).replace('T', ' ').replace('Z', '');
};

/**
 * Converts a local date to UTC date format.
 * @param date The date in YYYY-MM-DD format.
 */
export const dateTimeToUTCDate = (date: string): string => {
  // Convert date string to date
  const utcDate = new Date(date).toISOString();

  // Format UTC to YYYY-MM-DD HH:mm:ss format
  return utcDate.slice(0, 19).replace('T', ' ').replace('Z', '');
};

export const toLocalDate = (locale: string, date: string): string => {
  // Convert date string to date
  const utcDate = new Date(date);

  // Convert UTC date to local date
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  // Format local date to ISO format (YYYY-MM-DDTHH:mm:ss)
  return localDate.toISOString().slice(0, 19);
};
