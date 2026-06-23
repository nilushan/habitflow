import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CreateHabitInput, Habit } from "@/types/habit";

/**
 * Unit tests for the habit service.
 *
 * The database is fully mocked: each test sets the rows the mocked Drizzle
 * client should return, so these run hermetically with no Postgres connection.
 */

// Mutable holders the mocked db reads from; reset before every test.
const state = vi.hoisted(() => ({
  selectResult: [] as unknown[],
  insertResult: [] as unknown[],
  updateResult: [] as unknown[],
}));

vi.mock("@/lib/db", () => ({
  db: {
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve(state.insertResult),
      }),
    }),
    select: () => ({
      from: () => ({
        where: () => ({
          // getHabitById uses .limit(1); getHabitsByUserId uses .orderBy(...)
          limit: () => Promise.resolve(state.selectResult),
          orderBy: () => Promise.resolve(state.selectResult),
        }),
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve(state.updateResult),
        }),
      }),
    }),
    delete: () => ({
      where: () => Promise.resolve(undefined),
    }),
  },
}));

// Import after the mock is registered.
import {
  createHabit,
  getHabitsByUserId,
  getHabitById,
  updateHabit,
  archiveHabit,
  deleteHabit,
} from "@/lib/services/habit-service";

const userId = "00000000-0000-0000-0000-000000000001";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-123",
    userId,
    name: "Morning meditation",
    description: "10 minutes of mindfulness",
    category: "health",
    frequency: { type: "daily", timesPerDay: 1 },
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    archivedAt: null,
    sortOrder: 0,
    ...overrides,
  };
}

beforeEach(() => {
  state.selectResult = [];
  state.insertResult = [];
  state.updateResult = [];
});

describe("habit-service", () => {
  describe("createHabit", () => {
    it("creates a habit with daily frequency", async () => {
      const habit = makeHabit();
      state.insertResult = [habit];

      const input: CreateHabitInput = {
        name: habit.name,
        description: habit.description ?? undefined,
        category: "health",
        frequency: { type: "daily", timesPerDay: 1 },
      };
      const result = await createHabit(userId, input);

      expect(result.id).toBe(habit.id);
      expect(result.name).toBe(habit.name);
      expect(result.frequency).toEqual({ type: "daily", timesPerDay: 1 });
    });

    it("creates a habit with weekly frequency", async () => {
      const habit = makeHabit({
        frequency: { type: "weekly", daysOfWeek: [1, 3, 5], timesPerDay: 1 },
      });
      state.insertResult = [habit];

      const input: CreateHabitInput = {
        name: "Workout",
        category: "health",
        frequency: { type: "weekly", daysOfWeek: [1, 3, 5], timesPerDay: 1 },
      };
      const result = await createHabit(userId, input);

      expect(result.frequency).toEqual({
        type: "weekly",
        daysOfWeek: [1, 3, 5],
        timesPerDay: 1,
      });
    });

    it("throws for invalid input (empty name)", async () => {
      const input: CreateHabitInput = {
        name: "",
        category: "health",
        frequency: { type: "daily", timesPerDay: 1 },
      };
      await expect(createHabit(userId, input)).rejects.toThrow();
    });
  });

  describe("getHabitsByUserId", () => {
    it("returns the user's habits", async () => {
      state.selectResult = [makeHabit({ id: "h1" }), makeHabit({ id: "h2" })];
      const result = await getHabitsByUserId(userId);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("h1");
    });

    it("returns habits when includeArchived is true", async () => {
      state.selectResult = [makeHabit({ id: "h1", archivedAt: new Date() })];
      const result = await getHabitsByUserId(userId, { includeArchived: true });
      expect(result).toHaveLength(1);
    });
  });

  describe("getHabitById", () => {
    it("returns the habit when found", async () => {
      state.selectResult = [makeHabit()];
      const result = await getHabitById("habit-123", userId);
      expect(result?.id).toBe("habit-123");
    });

    it("returns null when not found", async () => {
      state.selectResult = [];
      const result = await getHabitById("missing", userId);
      expect(result).toBeNull();
    });
  });

  describe("updateHabit", () => {
    it("updates and returns the habit", async () => {
      state.selectResult = [makeHabit()]; // existing habit for the ownership check
      state.updateResult = [makeHabit({ name: "Updated" })];
      const result = await updateHabit("habit-123", userId, { name: "Updated" });
      expect(result.name).toBe("Updated");
    });

    it("throws when the habit does not exist", async () => {
      state.selectResult = []; // ownership check finds nothing
      await expect(
        updateHabit("missing", userId, { name: "x" })
      ).rejects.toThrow(/not found/i);
    });
  });

  describe("archiveHabit", () => {
    it("sets archivedAt", async () => {
      state.selectResult = [makeHabit()];
      state.updateResult = [makeHabit({ archivedAt: new Date("2025-02-01") })];
      const result = await archiveHabit("habit-123", userId);
      expect(result.archivedAt).toBeInstanceOf(Date);
    });
  });

  describe("deleteHabit", () => {
    it("resolves when the habit exists", async () => {
      state.selectResult = [makeHabit()];
      await expect(deleteHabit("habit-123", userId)).resolves.toBeUndefined();
    });

    it("throws when the habit does not exist", async () => {
      state.selectResult = [];
      await expect(deleteHabit("missing", userId)).rejects.toThrow(/not found/i);
    });
  });
});
