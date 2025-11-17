import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { CreateHabitInput } from "@/types/habit";

/**
 * Integration tests for Habit API endpoints
 *
 * NOTE: These tests require:
 * 1. A running development server (pnpm dev)
 * 2. A PostgreSQL database with the schema migrated
 *
 * To run: pnpm test __tests__/integration/api/habits.test.ts
 */

const API_BASE_URL = "http://localhost:3000";
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": TEST_USER_ID,
      ...options.headers,
    },
  });

  const data = await response.json();
  return { response, data };
}

describe("Habits API Integration Tests", () => {
  let createdHabitId: string | null = null;

  afterAll(async () => {
    // Cleanup: Delete the test habit if it was created
    if (createdHabitId) {
      await apiRequest(`/api/habits/${createdHabitId}`, {
        method: "DELETE",
      });
    }
  });

  describe("POST /api/habits", () => {
    it("should create a new habit with daily frequency", async () => {
      const newHabit: CreateHabitInput = {
        name: "Test Morning Meditation",
        description: "Test habit for integration testing",
        category: "health",
        frequency: {
          type: "daily",
          timesPerDay: 2,
        },
      };

      const { response, data } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      expect(response.status).toBe(201);
      expect(data.habit).toBeDefined();
      expect(data.habit.name).toBe(newHabit.name);
      expect(data.habit.description).toBe(newHabit.description);
      expect(data.habit.category).toBe(newHabit.category);
      expect(data.habit.frequency.type).toBe("daily");
      expect(data.habit.frequency.timesPerDay).toBe(2);
      expect(data.habit.id).toBeDefined();

      // Save for cleanup
      createdHabitId = data.habit.id;
    });

    it("should create a habit with weekly frequency", async () => {
      const newHabit: CreateHabitInput = {
        name: "Test Weekly Workout",
        category: "health",
        frequency: {
          type: "weekly",
          daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
          timesPerDay: 1,
        },
      };

      const { response, data } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      expect(response.status).toBe(201);
      expect(data.habit.frequency.type).toBe("weekly");
      expect(data.habit.frequency.daysOfWeek).toEqual([1, 3, 5]);

      // Cleanup this one too
      await apiRequest(`/api/habits/${data.habit.id}`, { method: "DELETE" });
    });

    it("should create a habit with custom frequency", async () => {
      const newHabit: CreateHabitInput = {
        name: "Test Custom Reading",
        category: "learning",
        frequency: {
          type: "custom",
          targetDays: 5,
          perWeeks: 2,
        },
      };

      const { response, data } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      expect(response.status).toBe(201);
      expect(data.habit.frequency.type).toBe("custom");
      expect(data.habit.frequency.targetDays).toBe(5);
      expect(data.habit.frequency.perWeeks).toBe(2);

      // Cleanup
      await apiRequest(`/api/habits/${data.habit.id}`, { method: "DELETE" });
    });

    it("should return 400 for invalid habit data", async () => {
      const invalidHabit = {
        name: "", // Empty name should fail validation
        category: "health",
        frequency: { type: "daily", timesPerDay: 1 },
      };

      const { response, data } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(invalidHabit),
      });

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("should return 401 without user authentication", async () => {
      const newHabit: CreateHabitInput = {
        name: "Test Habit",
        category: "health",
        frequency: { type: "daily", timesPerDay: 1 },
      };

      const response = await fetch(`${API_BASE_URL}/api/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No x-user-id header
        },
        body: JSON.stringify(newHabit),
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/habits", () => {
    it("should fetch all habits for the user", async () => {
      const { response, data } = await apiRequest("/api/habits");

      expect(response.status).toBe(200);
      expect(data.habits).toBeDefined();
      expect(Array.isArray(data.habits)).toBe(true);
    });

    it("should return empty array if user has no habits", async () => {
      const { response, data } = await apiRequest("/api/habits", {
        headers: {
          "x-user-id": "non-existent-user-123",
        },
      });

      expect(response.status).toBe(200);
      expect(data.habits).toEqual([]);
    });
  });

  describe("GET /api/habits/[id]", () => {
    it("should fetch a specific habit by ID", async () => {
      // First create a habit
      const newHabit: CreateHabitInput = {
        name: "Test Fetch Habit",
        category: "work",
        frequency: { type: "daily", timesPerDay: 1 },
      };

      const { data: createData } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      const habitId = createData.habit.id;

      // Now fetch it
      const { response, data } = await apiRequest(`/api/habits/${habitId}`);

      expect(response.status).toBe(200);
      expect(data.habit).toBeDefined();
      expect(data.habit.id).toBe(habitId);
      expect(data.habit.name).toBe(newHabit.name);

      // Cleanup
      await apiRequest(`/api/habits/${habitId}`, { method: "DELETE" });
    });

    it("should return 404 for non-existent habit", async () => {
      const { response } = await apiRequest(
        "/api/habits/00000000-0000-0000-0000-000000000000"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/habits/[id]", () => {
    it("should update a habit", async () => {
      // Create a habit first
      const newHabit: CreateHabitInput = {
        name: "Original Name",
        category: "health",
        frequency: { type: "daily", timesPerDay: 1 },
      };

      const { data: createData } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      const habitId = createData.habit.id;

      // Update it
      const updates = {
        name: "Updated Name",
        description: "Added description",
      };

      const { response, data } = await apiRequest(`/api/habits/${habitId}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });

      expect(response.status).toBe(200);
      expect(data.habit.name).toBe("Updated Name");
      expect(data.habit.description).toBe("Added description");

      // Cleanup
      await apiRequest(`/api/habits/${habitId}`, { method: "DELETE" });
    });
  });

  describe("DELETE /api/habits/[id]", () => {
    it("should delete a habit permanently", async () => {
      // Create a habit
      const newHabit: CreateHabitInput = {
        name: "To Be Deleted",
        category: "other",
        frequency: { type: "daily", timesPerDay: 1 },
      };

      const { data: createData } = await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });

      const habitId = createData.habit.id;

      // Delete it
      const { response } = await apiRequest(`/api/habits/${habitId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);

      // Verify it's gone
      const { response: fetchResponse } = await apiRequest(
        `/api/habits/${habitId}`
      );
      expect(fetchResponse.status).toBe(404);
    });
  });
});
