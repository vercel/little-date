import {
  isSameDay,
  isSameYear,
  isSameMonth,
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfDay,
  isSameMinute,
  startOfYear,
  getQuarter,
  startOfQuarter,
  endOfQuarter,
  endOfYear,
} from "date-fns";

const shortenAmPm = (text: string): string => {
  const shortened = (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");
  const withoutDoubleZero = shortened.replace(/:00/g, "");
  return withoutDoubleZero;
};

const removeLeadingZero = (text: string): string => text.replace(/^0/, "");

export const createFormatTime =
  (locale?: string) =>
  (date: Date): string =>
    removeLeadingZero(
      shortenAmPm(
        date.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
        }) || ""
      )
    );

const getNavigatorLanguage = (): string => {
  if (typeof window === "undefined") {
    return "en-US";
  }
  return window.navigator.language;
};

export interface DateRangeFormatOptions {
  today?: Date;
  locale?: string;
  includeTime?: boolean;
}

export const formatDateRange = (
  from: Date,
  to: Date,
  {
    today = new Date(),
    locale = getNavigatorLanguage(),
    includeTime = true,
  }: DateRangeFormatOptions = {}
): string => {
  const sameYear = isSameYear(from, to);
  const sameMonth = isSameMonth(from, to);
  const sameDay = isSameDay(from, to);
  const thisYear = isSameYear(from, today);
  const thisDay = isSameDay(from, today);

  const yearSuffix = thisYear ? "" : `, ${format(to, "yyyy")}`;

  const formatTime = createFormatTime(locale);

  const startTimeSuffix =
    includeTime && !isSameMinute(startOfDay(from), from)
      ? `, ${formatTime(from)}`
      : "";

  const endTimeSuffix =
    includeTime && !isSameMinute(endOfDay(to), to) ? `, ${formatTime(to)}` : "";

  // Check if the range is the entire year
  // Example: 2023
  if (
    isSameMinute(startOfYear(from), from) &&
    isSameMinute(endOfYear(to), to)
  ) {
    return `${format(from, "yyyy")}`;
  }

  // Check if the range is an entire quarter
  // Example: Q1 2023
  if (
    isSameMinute(startOfQuarter(from), from) &&
    isSameMinute(endOfQuarter(to), to) &&
    getQuarter(from) === getQuarter(to)
  ) {
    return `Q${getQuarter(from)} ${format(from, "yyyy")}`;
  }

  // Check if the range is the entire month
  // Example: January 2023
  if (
    isSameMinute(startOfMonth(from), from) &&
    isSameMinute(endOfMonth(to), to)
  ) {
    return `${format(from, "LLLL yyyy")}`;
  }

  // Range across years
  // Example: Jan 1 '23 - Feb 12 '24
  if (!sameYear) {
    return `${format(from, "LLL d ''yy")}${startTimeSuffix} - ${format(
      to,
      "LLL d ''yy"
    )}${endTimeSuffix}`;
  }

  // Range across months
  // Example: Jan 1 - Feb 12[, 2023]
  if (!sameMonth) {
    return `${format(from, "LLL d")}${startTimeSuffix} - ${format(
      to,
      "LLL d"
    )}${endTimeSuffix}${yearSuffix}`;
  }

  // Range across days
  if (!sameDay) {
    // Check for a time suffix, if so print the month twice
    // Example: Jan 1, 12:00pm - Jan 2, 1:00pm[, 2023]
    if (startTimeSuffix || endTimeSuffix) {
      return `${format(from, "LLL d")}${startTimeSuffix} - ${format(
        to,
        "LLL d"
      )}${endTimeSuffix}${yearSuffix}`;
    }

    // Example: Jan 1 - 12[, 2023]
    return `${format(from, "LLL d")} - ${format(to, "d")}${yearSuffix}`;
  }

  // Range across hours
  if (sameDay) {
    // With times
    // Example: Jan 1, 12:00pm - 1:00pm[, 2023]
    if (startTimeSuffix || endTimeSuffix) {
      // If it's today, don't include the date
      // Example: 12:00pm - 1:00pm
      if (thisDay) {
        return `${formatTime(from)} - ${formatTime(to)}`;
      }

      // If it's not today, include the date
      // Example: Jan 1, 12:00pm - 1:00pm[, 2023]
      return `${format(from, "LLL d")}${startTimeSuffix} - ${formatTime(
        to
      )}${yearSuffix}`;
    }

    // Full day
    // Example: Fri, Jan 1[, 2023]
    return `${format(from, "eee, LLL d")}${yearSuffix}`;
  }

  return `${from.toLocaleDateString(locale)} - ${to.toLocaleDateString(
    locale
  )}`;
};
