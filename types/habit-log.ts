import { z } from "zod";

/**
 * Log Entry Schema
 * Individual completion with timestamp
 */
export const LogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(), // ISO datetime
  note: z.string().max(200, "Entry note must be 200 characters or less").optional(),
});

/**
 * Habit Log Schema
 * Validates habit log input data with flexible counting
 */
export const CreateHabitLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  // Flexible counting
  count: z.number().int().min(0).optional(), // Defaults to 1 if not provided
  goal: z.number().int().min(1).optional(),  // Auto-calculated from habit frequency if not provided

  // Legacy: still support boolean for backward compat
  completed: z.boolean().optional(),

  // Individual entries
  entries: z.array(LogEntrySchema).optional(),

  // Overall note
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
});

export const UpdateHabitLogSchema = z.object({
  count: z.number().int().min(0).optional(),
  goal: z.number().int().min(1).optional(),
  completed: z.boolean().optional(),
  entries: z.array(LogEntrySchema).optional(),
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
});

/**
 * Habit Log Types
 */
export type LogEntry = z.infer<typeof LogEntrySchema>;
export type CreateHabitLogInput = z.infer<typeof CreateHabitLogSchema>;
export type UpdateHabitLogInput = z.infer<typeof UpdateHabitLogSchema>;

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format

  // Flexible counting
  count: number;
  goal: number;
  completed: boolean; // Auto-calculated: count >= goal

  // Individual entries
  entries: LogEntry[];

  // Overall note
  note: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Habit Log with Streak Information
 */
export interface HabitLogWithStats {
  habitId: string;
  logs: HabitLog[];
  currentStreak: number;
  longestStreak: number;
  completionRate7Day: number;
  completionRate30Day: number;
  totalCompletions: number;
}

/**
 * Date Range for querying logs
 */
export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
