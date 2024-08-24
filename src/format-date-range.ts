import {
	endOfDay,
	endOfMonth,
	endOfQuarter,
	endOfYear,
	format,
	getQuarter,
	isSameDay,
	isSameMinute,
	isSameMonth,
	isSameYear,
	startOfDay,
	startOfMonth,
	startOfQuarter,
	startOfYear,
} from "date-fns";

export const formatDateRange = (
	from: Date,
	to: Date,
	{
		today = new Date(),
		locale = getNavigatorLanguage(),
		includeTime = true,
		separator = "-",
	}: DateRangeFormatOptions = {},
): string => {
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

	const dateRangeType = determineDateRangeType(from, to);

	switch (dateRangeType) {
		case DateRangeType.YEAR:
			return formatYear(from);
		case DateRangeType.QUARTER:
			return formatQuarter(from);
		case DateRangeType.MONTH:
			return formatMonth(from, to, separator);
		case DateRangeType.ACROSS_YEARS:
			return formatAcrossYears(
				from,
				to,
				startTimeSuffix,
				endTimeSuffix,
				separator,
			);
		case DateRangeType.ACROSS_MONTHS:
			return formatAcrossMonths(
				from,
				to,
				startTimeSuffix,
				endTimeSuffix,
				separator,
				yearSuffix,
			);
		case DateRangeType.ACROSS_DAYS:
			return formatAcrossDays(
				from,
				to,
				startTimeSuffix,
				endTimeSuffix,
				separator,
				yearSuffix,
			);
		case DateRangeType.SAME_DAY:
		case DateRangeType.FULL_DAY:
			return formatSameDay({
				from,
				to,
				startTimeSuffix,
				endTimeSuffix,
				separator,
				yearSuffix,
				thisDay,
				formatTime,
			});
	}
};

function shortenAmPm(text: string): string {
	const shortened = (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");

	return shortened.includes("m") ? shortened.replace(/:00/g, "") : shortened;
}

function removeLeadingZero(text: string): string {
	return text.replace(/^0/, "");
}

export function formatTime(date: Date, locale?: string): string {
	return removeLeadingZero(
		shortenAmPm(
			date.toLocaleTimeString(locale, {
				hour: "2-digit",
				minute: "2-digit",
			}) || "",
		),
	);
}

function createFormatTime(locale?: string) {
	return (date: Date): string => formatTime(date, locale);
}

function getNavigatorLanguage(): string {
	if (typeof window === "undefined") {
		return "en-US";
	}
	return window.navigator.language;
}

export interface DateRangeFormatOptions {
	today?: Date;
	locale?: string;
	includeTime?: boolean;
	separator?: string;
}

function determineDateRangeType(from: Date, to: Date): DateRangeType {
	if (
		isSameMinute(startOfYear(from), from) &&
		isSameMinute(endOfYear(to), to)
	) {
		return DateRangeType.YEAR;
	}

	if (
		isSameMinute(startOfQuarter(from), from) &&
		isSameMinute(endOfQuarter(to), to) &&
		getQuarter(from) === getQuarter(to)
	) {
		return DateRangeType.QUARTER;
	}
	if (
		isSameMinute(startOfMonth(from), from) &&
		isSameMinute(endOfMonth(to), to)
	) {
		return DateRangeType.MONTH;
	}
	if (!isSameYear(from, to)) {
		return DateRangeType.ACROSS_YEARS;
	}
	if (!isSameMonth(from, to)) {
		return DateRangeType.ACROSS_MONTHS;
	}
	if (!isSameDay(from, to)) {
		return DateRangeType.ACROSS_DAYS;
	}
	if (isSameDay(from, to)) {
		return DateRangeType.SAME_DAY;
	}
	return DateRangeType.FULL_DAY;
}

function formatYear(from: Date): string {
	return `${format(from, "yyyy")}`;
}

function formatQuarter(from: Date): string {
	return `Q${getQuarter(from)} ${format(from, "yyyy")}`;
}

function formatMonth(from: Date, to: Date, separator: string): string {
	if (isSameMonth(from, to) && isSameYear(from, to)) {
		// Example: January 2023
		return `${format(from, "LLLL yyyy")}`;
	}
	// Example: Jan - Feb 2023
	return `${format(from, "LLL")} ${separator} ${format(to, "LLL yyyy")}`;
}

function formatAcrossYears(
	from: Date,
	to: Date,
	startTimeSuffix: string,
	endTimeSuffix: string,
	separator: string,
): string {
	// Example: Jan 1 '23 - Feb 12 '24

	return `${format(from, "LLL d ''yy")}${startTimeSuffix} ${separator} ${format(to, "LLL d ''yy")}${endTimeSuffix}`;
}

function formatAcrossMonths(
	from: Date,
	to: Date,
	startTimeSuffix: string,
	endTimeSuffix: string,
	separator: string,
	yearSuffix: string,
): string {
	// Example: Jan 1 - Feb 12[, 2023]

	return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(to, "LLL d")}${endTimeSuffix}${yearSuffix}`;
}

function formatAcrossDays(
	from: Date,
	to: Date,
	startTimeSuffix: string,
	endTimeSuffix: string,
	separator: string,
	yearSuffix: string,
): string {
	// Check for a time suffix, if so print the month twice
	// Example: Jan 1, 12:00pm - Jan 2, 1:00pm[, 2023]
	if (startTimeSuffix || endTimeSuffix) {
		return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${format(to, "LLL d")}${endTimeSuffix}${yearSuffix}`;
	}

	// Example: Jan 1 - 12[, 2023]
	return `${format(from, "LLL d")} ${separator} ${format(to, "d")}${yearSuffix}`;
}

function formatSameDay({
	from,
	to,
	startTimeSuffix,
	endTimeSuffix,
	separator,
	yearSuffix,
	thisDay,
	formatTime,
}: {
	from: Date;
	to: Date;
	startTimeSuffix: string;
	endTimeSuffix: string;
	separator: string;
	yearSuffix: string;
	thisDay: boolean;
	formatTime: (date: Date) => string;
}): string {
	// Same day, different times
	// Example: Jan 1, 12pm - 1pm[, 2023]
	if (startTimeSuffix || endTimeSuffix) {
		// If it's today, don't include the date
		// Example: 12:30pm - 1pm
		if (thisDay) {
			return `${formatTime(from)} ${separator} ${formatTime(to)}`;
		}

		// Example: Jan 1, 12pm - 1pm[, 2023]

		return `${format(from, "LLL d")}${startTimeSuffix} ${separator} ${formatTime(to)}${yearSuffix}`;
	}

	// Full day
	// Example: Fri, Jan 1[, 2023]
	return `${format(from, "eee, LLL d")}${yearSuffix}`;
}

enum DateRangeType {
	YEAR = "YEAR",
	QUARTER = "QUARTER",
	MONTH = "MONTH",
	ACROSS_YEARS = "ACROSS_YEARS",
	ACROSS_MONTHS = "ACROSS_MONTHS",
	ACROSS_DAYS = "ACROSS_DAYS",
	SAME_DAY = "SAME_DAY",
	FULL_DAY = "FULL_DAY",
}
