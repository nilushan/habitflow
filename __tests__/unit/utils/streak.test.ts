import { describe, it, expect } from "vitest";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getCompletionRate,
  type HabitLog,
} from "@/lib/utils/streak";

describe("Streak Calculation Utils", () => {
  describe("calculateCurrentStreak", () => {
    it("should return 0 for empty logs", () => {
      const logs: HabitLog[] = [];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(0);
    });

    it("should return 1 for today's completion only", () => {
      const today = new Date().toISOString().split("T")[0];
      const logs: HabitLog[] = [
        { date: today, completed: true },
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(1);
    });

    it("should return 0 if today is not completed", () => {
      const today = new Date().toISOString().split("T")[0];
      const logs: HabitLog[] = [
        { date: today, completed: false },
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(0);
    });

    it("should calculate consecutive days correctly", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true }, // Today
        { date: formatDate(addDays(today, -1)), completed: true }, // Yesterday
        { date: formatDate(addDays(today, -2)), completed: true }, // 2 days ago
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(3);
    });

    it("should break streak on missed day", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true }, // Today
        { date: formatDate(addDays(today, -1)), completed: false }, // Yesterday (missed)
        { date: formatDate(addDays(today, -2)), completed: true }, // 2 days ago
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(1); // Only today counts
    });

    it("should handle gaps in logs (treat as missed)", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true }, // Today
        // Gap: yesterday is missing
        { date: formatDate(addDays(today, -2)), completed: true }, // 2 days ago
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(1); // Gap breaks streak
    });

    it("should count yesterday's streak if today not completed yet", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, -1)), completed: true }, // Yesterday
        { date: formatDate(addDays(today, -2)), completed: true }, // 2 days ago
        { date: formatDate(addDays(today, -3)), completed: true }, // 3 days ago
      ];
      const streak = calculateCurrentStreak(logs);
      expect(streak).toBe(3); // Yesterday's streak is still active
    });
  });

  describe("calculateLongestStreak", () => {
    it("should return 0 for empty logs", () => {
      const logs: HabitLog[] = [];
      const longest = calculateLongestStreak(logs);
      expect(longest).toBe(0);
    });

    it("should find longest streak in history", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        // Current streak: 2 days
        { date: formatDate(addDays(today, 0)), completed: true },
        { date: formatDate(addDays(today, -1)), completed: true },
        { date: formatDate(addDays(today, -2)), completed: false }, // Break
        // Previous streak: 5 days (longest)
        { date: formatDate(addDays(today, -3)), completed: true },
        { date: formatDate(addDays(today, -4)), completed: true },
        { date: formatDate(addDays(today, -5)), completed: true },
        { date: formatDate(addDays(today, -6)), completed: true },
        { date: formatDate(addDays(today, -7)), completed: true },
        { date: formatDate(addDays(today, -8)), completed: false }, // Break
        // Earlier streak: 2 days
        { date: formatDate(addDays(today, -9)), completed: true },
        { date: formatDate(addDays(today, -10)), completed: true },
      ];
      const longest = calculateLongestStreak(logs);
      expect(longest).toBe(5);
    });

    it("should return current streak if it's the longest", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true },
        { date: formatDate(addDays(today, -1)), completed: true },
        { date: formatDate(addDays(today, -2)), completed: true },
      ];
      const longest = calculateLongestStreak(logs);
      expect(longest).toBe(3);
    });

    it("should handle multiple equal longest streaks", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        // First streak: 3 days
        { date: formatDate(addDays(today, -1)), completed: true },
        { date: formatDate(addDays(today, -2)), completed: true },
        { date: formatDate(addDays(today, -3)), completed: true },
        { date: formatDate(addDays(today, -4)), completed: false }, // Break
        // Second streak: 3 days
        { date: formatDate(addDays(today, -5)), completed: true },
        { date: formatDate(addDays(today, -6)), completed: true },
        { date: formatDate(addDays(today, -7)), completed: true },
      ];
      const longest = calculateLongestStreak(logs);
      expect(longest).toBe(3);
    });
  });

  describe("getCompletionRate", () => {
    it("should return 0 for empty logs", () => {
      const logs: HabitLog[] = [];
      const rate = getCompletionRate(logs, 7);
      expect(rate).toBe(0);
    });

    it("should calculate 7-day completion rate", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true },
        { date: formatDate(addDays(today, -1)), completed: true },
        { date: formatDate(addDays(today, -2)), completed: false },
        { date: formatDate(addDays(today, -3)), completed: true },
        { date: formatDate(addDays(today, -4)), completed: true },
        { date: formatDate(addDays(today, -5)), completed: true },
        { date: formatDate(addDays(today, -6)), completed: false },
      ];
      const rate = getCompletionRate(logs, 7);
      expect(rate).toBe(71.43); // 5/7 = 71.43%
    });

    it("should calculate 30-day completion rate", () => {
      const today = new Date();
      const logs: HabitLog[] = [];
      // 20 completed, 10 missed in last 30 days
      for (let i = 0; i < 30; i++) {
        logs.push({
          date: formatDate(addDays(today, -i)),
          completed: i < 20,
        });
      }
      const rate = getCompletionRate(logs, 30);
      expect(rate).toBe(66.67); // 20/30 = 66.67%
    });

    it("should handle fewer logs than requested days", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true },
        { date: formatDate(addDays(today, -1)), completed: true },
      ];
      const rate = getCompletionRate(logs, 7);
      // Only 2 days of data, treat missing days as 0
      expect(rate).toBe(28.57); // 2/7 = 28.57%
    });

    it("should return 100 for perfect completion", () => {
      const today = new Date();
      const logs: HabitLog[] = [
        { date: formatDate(addDays(today, 0)), completed: true },
        { date: formatDate(addDays(today, -1)), completed: true },
        { date: formatDate(addDays(today, -2)), completed: true },
        { date: formatDate(addDays(today, -3)), completed: true },
        { date: formatDate(addDays(today, -4)), completed: true },
        { date: formatDate(addDays(today, -5)), completed: true },
        { date: formatDate(addDays(today, -6)), completed: true },
      ];
      const rate = getCompletionRate(logs, 7);
      expect(rate).toBe(100);
    });
  });
});

// Helper functions for tests
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
