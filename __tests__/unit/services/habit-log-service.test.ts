import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createHabitLog,
  getHabitLogs,
  getHabitLogsByDateRange,
  updateHabitLog,
  deleteHabitLog,
  getHabitLogsWithStats,
} from "@/lib/services/habit-log-service";
import { db } from "@/lib/db";
import type { CreateHabitLogInput } from "@/types/habit-log";

// Mock the database
vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Habit Log Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createHabitLog", () => {
    it("should create a new habit log", async () => {
      const mockLog = {
        id: "log-123",
        habitId: "habit-456",
        date: "2025-01-15",
        completed: true,
        note: "Great day!",
        createdAt: new Date(),
      };

      // Mock select query for existence check (no existing log)
      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]), // No existing log
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const mockInsert = {
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockLog]),
        }),
      };

      (db.insert as any).mockReturnValue(mockInsert);

      const input: CreateHabitLogInput = {
        date: "2025-01-15",
        completed: true,
        note: "Great day!",
      };

      const result = await createHabitLog("habit-456", input);

      expect(result).toEqual(mockLog);
      expect(db.insert).toHaveBeenCalled();
      expect(mockInsert.values).toHaveBeenCalledWith({
        habitId: "habit-456",
        date: "2025-01-15",
        completed: true,
        note: "Great day!",
      });
    });

    it("should validate input data", async () => {
      const invalidInput = {
        date: "invalid-date",
        completed: true,
      };

      await expect(
        createHabitLog("habit-456", invalidInput as any)
      ).rejects.toThrow();
    });

    it("should handle optional note field", async () => {
      const mockLog = {
        id: "log-123",
        habitId: "habit-456",
        date: "2025-01-15",
        completed: true,
        note: null,
        createdAt: new Date(),
      };

      // Mock select query for existence check (no existing log)
      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]), // No existing log
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const mockInsert = {
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockLog]),
        }),
      };

      (db.insert as any).mockReturnValue(mockInsert);

      const input: CreateHabitLogInput = {
        date: "2025-01-15",
        completed: false,
      };

      const result = await createHabitLog("habit-456", input);

      expect(result.note).toBeNull();
    });
  });

  describe("getHabitLogs", () => {
    it("should retrieve all logs for a habit", async () => {
      const mockLogs = [
        {
          id: "log-1",
          habitId: "habit-456",
          date: "2025-01-15",
          completed: true,
          note: null,
          createdAt: new Date(),
        },
        {
          id: "log-2",
          habitId: "habit-456",
          date: "2025-01-14",
          completed: false,
          note: "Missed",
          createdAt: new Date(),
        },
      ];

      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockLogs),
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const result = await getHabitLogs("habit-456");

      expect(result).toEqual(mockLogs);
      expect(result).toHaveLength(2);
    });

    it("should return empty array for habit with no logs", async () => {
      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue([]),
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const result = await getHabitLogs("habit-456");

      expect(result).toEqual([]);
    });
  });

  describe("getHabitLogsByDateRange", () => {
    it("should retrieve logs within date range", async () => {
      const mockLogs = [
        {
          id: "log-1",
          habitId: "habit-456",
          date: "2025-01-15",
          completed: true,
          note: null,
          createdAt: new Date(),
        },
      ];

      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockLogs),
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const result = await getHabitLogsByDateRange(
        "habit-456",
        "2025-01-01",
        "2025-01-31"
      );

      expect(result).toEqual(mockLogs);
    });
  });

  describe("updateHabitLog", () => {
    it("should update an existing habit log", async () => {
      const mockUpdated = {
        id: "log-123",
        habitId: "habit-456",
        date: "2025-01-15",
        completed: false,
        note: "Updated note",
        createdAt: new Date(),
      };

      const mockUpdate = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdated]),
          }),
        }),
      };

      (db.update as any).mockReturnValue(mockUpdate);

      const updates = {
        completed: false,
        note: "Updated note",
      };

      const result = await updateHabitLog("habit-456", "2025-01-15", updates);

      expect(result).toEqual(mockUpdated);
    });

    it("should throw error if log not found", async () => {
      const mockUpdate = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      };

      (db.update as any).mockReturnValue(mockUpdate);

      await expect(
        updateHabitLog("habit-456", "2025-01-15", { completed: true })
      ).rejects.toThrow("Habit log not found");
    });
  });

  describe("deleteHabitLog", () => {
    it("should delete a habit log", async () => {
      const mockDelete = {
        where: vi.fn().mockResolvedValue(undefined),
      };

      (db.delete as any).mockReturnValue(mockDelete);

      await deleteHabitLog("habit-456", "2025-01-15");

      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("getHabitLogsWithStats", () => {
    it("should return logs with calculated statistics", async () => {
      const mockLogs = [
        {
          id: "log-1",
          habitId: "habit-456",
          date: "2025-01-15",
          completed: true,
          note: null,
          createdAt: new Date(),
        },
        {
          id: "log-2",
          habitId: "habit-456",
          date: "2025-01-14",
          completed: true,
          note: null,
          createdAt: new Date(),
        },
        {
          id: "log-3",
          habitId: "habit-456",
          date: "2025-01-13",
          completed: true,
          note: null,
          createdAt: new Date(),
        },
      ];

      const mockSelect = {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockLogs),
          }),
        }),
      };

      (db.select as any).mockReturnValue(mockSelect);

      const result = await getHabitLogsWithStats("habit-456");

      expect(result.habitId).toBe("habit-456");
      expect(result.logs).toEqual(mockLogs);
      expect(result.currentStreak).toBeGreaterThanOrEqual(0);
      expect(result.longestStreak).toBeGreaterThanOrEqual(0);
      expect(result.completionRate7Day).toBeGreaterThanOrEqual(0);
      expect(result.completionRate30Day).toBeGreaterThanOrEqual(0);
      expect(result.totalCompletions).toBe(3);
    });
  });
});
