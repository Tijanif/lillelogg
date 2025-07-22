
import { startOfDay, subDays } from 'date-fns';
import prisma from '@/lib/prisma';

/**
 * Calculates the start date for analytics queries based on the number of days.
 * @param days The number of days to look back (e.g., 7 or 30).
 * @returns Date object representing the start of the period.
 */
export function getAnalyticsStartDate(days: number): Date {
    const today = startOfDay(new Date());
    // e.g., for 7 days, we want to go back 6 days from today to get a total of 7 days inclusive.
    return subDays(today, days - 1);
}