import { z } from "zod";

/**
 * Habit Categories
 */
export const HabitCategory = z.enum([
  "health",
  "work",
  "learning",
  "social",
  "other",
]);

export type HabitCategory = z.infer<typeof HabitCategory>;

/**
 * Habit Frequency Types
 */
export const DailyFrequency = z.object({
  type: z.literal("daily"),
  timesPerDay: z.number().int().min(1).max(10),
});

export const WeeklyFrequency = z.object({
  type: z.literal("weekly"),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1, "Select at least one day"),
  timesPerDay: z.number().int().min(1).max(10),
});

export const CustomFrequency = z.object({
  type: z.literal("custom"),
  targetDays: z.number().int().min(1).max(365),
  perWeeks: z.number().int().min(1).max(52),
});

export const HabitFrequency = z.discriminatedUnion("type", [
  DailyFrequency,
  WeeklyFrequency,
  CustomFrequency,
]);

export type HabitFrequency = z.infer<typeof HabitFrequency>;

/**
 * Create Habit Input Schema
 * Used for creating new habits
 */
export const CreateHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  category: HabitCategory,
  frequency: HabitFrequency,
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;

/**
 * Update Habit Input Schema
 * Used for updating existing habits
 */
export const UpdateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  category: HabitCategory.optional(),
  frequency: HabitFrequency.optional(),
  archivedAt: z.date().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

export type UpdateHabitInput = z.infer<typeof UpdateHabitSchema>;

/**
 * Habit Type (matches database schema)
 */
export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  frequency: HabitFrequency;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  sortOrder: number;
}

/**
 * Habit with computed fields
 * Used in the UI to display additional information
 */
export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // 0-100
  totalCompletions: number;
}
