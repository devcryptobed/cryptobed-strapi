import {
  addHours,
  differenceInHours,
  differenceInDays,
  parseISO,
  subHours,
  isAfter,
  isEqual,
} from "date-fns";

export function addHoursToCurrentDate(hours: number): string {
  const now = new Date();
  const newDate = addHours(now, hours);
  return newDate.toISOString();
}

export function subtractHoursFromCurrentDate(hours: number): string {
  const now = new Date();
  const newDate = subHours(now, hours);
  return newDate.toISOString();
}

export function hasHoursPassed(
  dateString: string,
  time: string,
  hours: number
): boolean {
  const dateToCheck = new Date(`${dateString}T${time}Z`);
  const now = new Date();
  const expectedDate = subHours(now, hours);

  return (
    isEqual(expectedDate, dateToCheck) || isAfter(expectedDate, dateToCheck)
  );
}

export function getHoursRemaining(targetHours: number): number {
  const now = new Date();
  const targetDate = addHours(now, targetHours);

  const hoursRemaining = differenceInHours(targetDate, now);

  return hoursRemaining;
}

export function calculateDifferenceInNights(from: string, to: string): number {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  const difference = differenceInDays(toDate, fromDate);

  return difference;
}
