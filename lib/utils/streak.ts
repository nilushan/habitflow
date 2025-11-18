/**
 * Habit Log type for streak calculations
 */
export interface HabitLog {
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
}

/**
 * Calculate the current active streak
 * Counts consecutive days from today (or yesterday if today not completed yet)
 *
 * @param logs - Array of habit logs sorted by date (any order)
 * @returns Current streak count
 */
export function calculateCurrentStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  // Sort logs by date descending (most recent first)
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date();
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(addDays(today, -1));

  // Create a map for quick lookup
  const logMap = new Map<string, boolean>();
  sortedLogs.forEach((log) => {
    logMap.set(log.date, log.completed);
  });

  // Start from today or yesterday if today not completed
  let startDate: Date;
  const todayCompleted = logMap.get(todayStr);

  if (todayCompleted === true) {
    startDate = today;
  } else if (logMap.get(yesterdayStr) === true) {
    // If today not completed but yesterday was, count from yesterday
    startDate = addDays(today, -1);
  } else {
    // No recent completion
    return 0;
  }

  // Count consecutive days backward
  let streak = 0;
  let currentDate = startDate;

  while (true) {
    const dateStr = formatDate(currentDate);
    const completed = logMap.get(dateStr);

    if (completed === true) {
      streak++;
      currentDate = addDays(currentDate, -1);
    } else {
      // Streak broken (either false or missing)
      break;
    }
  }

  return streak;
}

/**
 * Calculate the longest streak in the entire history
 *
 * @param logs - Array of habit logs
 * @returns Longest streak count
 */
export function calculateLongestStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const log of sortedLogs) {
    const logDate = parseDate(log.date);

    if (log.completed) {
      if (previousDate === null) {
        // First completed log
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (logDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === 1) {
          // Consecutive day
          currentStreak++;
        } else {
          // Gap in streak
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      previousDate = logDate;
    } else {
      // Missed day breaks streak
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0;
      previousDate = null;
    }
  }

  // Check final streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
}

/**
 * Calculate completion rate over a specific period
 *
 * @param logs - Array of habit logs
 * @param days - Number of days to look back (e.g., 7, 30)
 * @returns Completion percentage (0-100) rounded to 2 decimal places
 */
export function getCompletionRate(logs: HabitLog[], days: number): number {
  if (logs.length === 0) return 0;

  const today = new Date();
  const startDate = addDays(today, -(days - 1)); // Include today

  // Create a map for quick lookup
  const logMap = new Map<string, boolean>();
  logs.forEach((log) => {
    logMap.set(log.date, log.completed);
  });

  let completedCount = 0;
  let currentDate = new Date(startDate);

  // Count completions in the date range
  for (let i = 0; i < days; i++) {
    const dateStr = formatDate(currentDate);
    const completed = logMap.get(dateStr);

    if (completed === true) {
      completedCount++;
    }

    currentDate = addDays(currentDate, 1);
  }

  const rate = (completedCount / days) * 100;
  return Math.round(rate * 100) / 100; // Round to 2 decimal places
}

// Helper functions

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse YYYY-MM-DD string to Date
 */
function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}
