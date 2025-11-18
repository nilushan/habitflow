import type { Habit } from "@/types/habit";

/**
 * Calculate the daily goal (target count) for a habit on a specific date
 * This determines how many times the habit should be completed
 *
 * @param habit - The habit with frequency configuration
 * @param date - The date to calculate for (YYYY-MM-DD)
 * @returns The target count for that day
 */
export function calculateDailyGoal(habit: Habit, date: string): number {
  const frequency = habit.frequency;

  // Daily frequency: return timesPerDay
  if (frequency.type === "daily") {
    return frequency.timesPerDay;
  }

  // Weekly frequency: check if today is a scheduled day
  if (frequency.type === "weekly") {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    const isScheduledDay = frequency.daysOfWeek.includes(dayOfWeek);
    return isScheduledDay ? frequency.timesPerDay : 0;
  }

  // Custom frequency: spread target across days
  if (frequency.type === "custom") {
    // For simplicity, spread evenly across week
    // Example: 5 days per 2 weeks = ~0.36 per day, but we need integers
    // So we return 1 on some days, 0 on others to average out
    const daysInPeriod = frequency.perWeeks * 7;
    const targetDays = frequency.targetDays;

    // Simple approach: mark first N days of each period
    const dateObj = new Date(date + "T00:00:00");
    const dayOfYear = Math.floor(
      (dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const dayInPeriod = dayOfYear % daysInPeriod;

    return dayInPeriod < targetDays ? 1 : 0;
  }

  // Default: once per day
  return 1;
}

/**
 * Check if a habit log is considered "completed" based on count vs goal
 *
 * @param count - Actual completion count
 * @param goal - Target count
 * @returns true if count >= goal
 */
export function isLogCompleted(count: number, goal: number): boolean {
  return count >= goal;
}

/**
 * Calculate progress percentage
 *
 * @param count - Actual completion count
 * @param goal - Target count
 * @returns Percentage (0-100), capped at 100
 */
export function calculateProgress(count: number, goal: number): number {
  if (goal === 0) return 100; // No goal = already complete
  const percentage = (count / goal) * 100;
  return Math.min(percentage, 100); // Cap at 100%
}
