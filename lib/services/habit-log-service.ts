import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { habitLogs, habits } from "@/lib/db/schema";
import {
  CreateHabitLogSchema,
  UpdateHabitLogSchema,
} from "@/types/habit-log";
import type {
  CreateHabitLogInput,
  UpdateHabitLogInput,
  HabitLog,
  HabitLogWithStats,
  LogEntry,
} from "@/types/habit-log";
import type { Habit } from "@/types/habit";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getCompletionRate,
} from "@/lib/utils/streak";
import { calculateDailyGoal, isLogCompleted } from "@/lib/utils/habit-goals";

/**
 * Create or update a habit log for a specific date with flexible counting
 * If a log already exists for that date, it will be updated
 */
export async function createHabitLog(
  habitId: string,
  input: CreateHabitLogInput
): Promise<HabitLog> {
  // Validate input
  const validated = CreateHabitLogSchema.parse(input);

  // Get the habit to calculate goal if not provided
  const [habit] = await db
    .select()
    .from(habits)
    .where(eq(habits.id, habitId))
    .limit(1);

  if (!habit) {
    throw new Error("Habit not found");
  }

  // Calculate goal if not provided
  const goal = validated.goal ?? calculateDailyGoal(habit as Habit, validated.date);

  // Determine count
  let count: number;
  if (validated.count !== undefined) {
    count = validated.count;
  } else if (validated.completed !== undefined) {
    // Backward compatibility: boolean completed
    count = validated.completed ? goal : 0;
  } else {
    // Default: increment by 1
    count = 1;
  }

  // Auto-calculate completed status
  const completed = isLogCompleted(count, goal);

  // Prepare entries
  const entries = validated.entries ?? [];

  // Check if a log already exists for this date
  const existing = await db
    .select()
    .from(habitLogs)
    .where(
      and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, validated.date))
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing log
    const [updated] = await db
      .update(habitLogs)
      .set({
        count,
        goal,
        completed,
        entries: JSON.stringify(entries),
        note: validated.note ?? null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, validated.date))
      )
      .returning();

    return {
      ...updated,
      entries: Array.isArray(updated.entries) ? updated.entries : JSON.parse(updated.entries as string || '[]'),
    } as HabitLog;
  }

  // Insert new log
  const [log] = await db
    .insert(habitLogs)
    .values({
      habitId,
      date: validated.date,
      count,
      goal,
      completed,
      entries: JSON.stringify(entries),
      note: validated.note ?? null,
    })
    .returning();

  if (!log) {
    throw new Error("Failed to create habit log");
  }

  return {
    ...log,
    entries: Array.isArray(log.entries) ? log.entries : JSON.parse(log.entries as string || '[]'),
  } as HabitLog;
}

/**
 * Increment the count for a habit log (convenience function)
 */
export async function incrementHabitLog(
  habitId: string,
  date: string,
  incrementBy: number = 1
): Promise<HabitLog> {
  // Get existing log or create new one
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  if (existing.length > 0) {
    const current = existing[0];
    const newCount = (current.count || 0) + incrementBy;
    const completed = isLogCompleted(newCount, current.goal || 1);

    const [updated] = await db
      .update(habitLogs)
      .set({
        count: newCount,
        completed,
        updatedAt: new Date(),
      })
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      .returning();

    return {
      ...updated,
      entries: Array.isArray(updated.entries) ? updated.entries : JSON.parse(updated.entries as string || '[]'),
    } as HabitLog;
  }

  // Create new log with count
  return createHabitLog(habitId, { date, count: incrementBy });
}

/**
 * Add a log entry with timestamp to a habit log
 */
export async function addLogEntry(
  habitId: string,
  date: string,
  entry: Omit<LogEntry, "id">
): Promise<HabitLog> {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  const newEntry: LogEntry = {
    id: crypto.randomUUID(),
    ...entry,
  };

  if (existing.length > 0) {
    const current = existing[0];
    const currentEntries = Array.isArray(current.entries)
      ? current.entries
      : JSON.parse(current.entries as string || '[]');

    const updatedEntries = [...currentEntries, newEntry];
    const newCount = (current.count || 0) + 1; // Increment existing count
    const completed = isLogCompleted(newCount, current.goal || 1);

    const [updated] = await db
      .update(habitLogs)
      .set({
        count: newCount,
        completed,
        entries: JSON.stringify(updatedEntries),
        updatedAt: new Date(),
      })
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      .returning();

    return {
      ...updated,
      entries: updatedEntries,
    } as HabitLog;
  }

  // Create new log with entry
  return createHabitLog(habitId, {
    date,
    count: 1,
    entries: [newEntry],
  });
}

/**
 * Remove the last log entry from a habit log
 * This is used for decrement operations to maintain sync between count and entries
 */
export async function removeLastLogEntry(
  habitId: string,
  date: string
): Promise<HabitLog> {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Habit log not found");
  }

  const current = existing[0];
  const currentEntries = Array.isArray(current.entries)
    ? current.entries
    : JSON.parse(current.entries as string || '[]');

  if (currentEntries.length === 0) {
    throw new Error("No entries to remove");
  }

  // Sort by timestamp (newest first) and remove the most recent
  const sortedEntries = [...currentEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  sortedEntries.shift(); // Remove the first (most recent) entry

  const updatedEntries = sortedEntries;
  const newCount = Math.max(0, (current.count || 0) - 1);
  const completed = isLogCompleted(newCount, current.goal || 1);

  const [updated] = await db
    .update(habitLogs)
    .set({
      count: newCount,
      completed,
      entries: JSON.stringify(updatedEntries),
      updatedAt: new Date(),
    })
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .returning();

  if (!updated) {
    throw new Error("Failed to remove entry");
  }

  return {
    ...updated,
    entries: updatedEntries,
  } as HabitLog;
}

/**
 * Update a specific log entry's note
 */
export async function updateLogEntry(
  habitId: string,
  date: string,
  entryId: string,
  note?: string
): Promise<HabitLog> {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Habit log not found");
  }

  const current = existing[0];
  const currentEntries = Array.isArray(current.entries)
    ? current.entries
    : JSON.parse(current.entries as string || '[]');

  // Find and update the entry
  const entryIndex = currentEntries.findIndex((e: LogEntry) => e.id === entryId);
  if (entryIndex === -1) {
    throw new Error("Entry not found");
  }

  const updatedEntries = [...currentEntries];
  updatedEntries[entryIndex] = {
    ...updatedEntries[entryIndex],
    note,
  };

  const [updated] = await db
    .update(habitLogs)
    .set({
      entries: JSON.stringify(updatedEntries),
      updatedAt: new Date(),
    })
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .returning();

  if (!updated) {
    throw new Error("Failed to update entry");
  }

  return {
    ...updated,
    entries: updatedEntries,
  } as HabitLog;
}

/**
 * Delete a specific log entry by ID
 */
export async function deleteLogEntry(
  habitId: string,
  date: string,
  entryId: string
): Promise<HabitLog> {
  const existing = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Habit log not found");
  }

  const current = existing[0];
  const currentEntries = Array.isArray(current.entries)
    ? current.entries
    : JSON.parse(current.entries as string || '[]');

  // Filter out the entry
  const updatedEntries = currentEntries.filter((e: LogEntry) => e.id !== entryId);

  if (updatedEntries.length === currentEntries.length) {
    throw new Error("Entry not found");
  }

  // Decrement count
  const newCount = Math.max(0, (current.count || 0) - 1);
  const completed = isLogCompleted(newCount, current.goal || 1);

  const [updated] = await db
    .update(habitLogs)
    .set({
      count: newCount,
      completed,
      entries: JSON.stringify(updatedEntries),
      updatedAt: new Date(),
    })
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .returning();

  if (!updated) {
    throw new Error("Failed to delete entry");
  }

  return {
    ...updated,
    entries: updatedEntries,
  } as HabitLog;
}

/**
 * Get all logs for a specific habit
 */
export async function getHabitLogs(habitId: string): Promise<HabitLog[]> {
  const logs = await db
    .select()
    .from(habitLogs)
    .where(eq(habitLogs.habitId, habitId))
    .orderBy(desc(habitLogs.date));

  return logs.map(log => ({
    ...log,
    entries: Array.isArray(log.entries) ? log.entries : JSON.parse(log.entries as string || '[]'),
  })) as HabitLog[];
}

/**
 * Get logs for a specific habit within a date range
 */
export async function getHabitLogsByDateRange(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  const logs = await db
    .select()
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.habitId, habitId),
        gte(habitLogs.date, startDate),
        lte(habitLogs.date, endDate)
      )
    )
    .orderBy(desc(habitLogs.date));

  return logs.map(log => ({
    ...log,
    entries: Array.isArray(log.entries) ? log.entries : JSON.parse(log.entries as string || '[]'),
  })) as HabitLog[];
}

/**
 * Update an existing habit log
 */
export async function updateHabitLog(
  habitId: string,
  date: string,
  updates: UpdateHabitLogInput
): Promise<HabitLog> {
  // Validate input
  const validated = UpdateHabitLogSchema.parse(updates);

  // If count is being updated, recalculate completed status
  if (validated.count !== undefined) {
    const existing = await db
      .select()
      .from(habitLogs)
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      .limit(1);

    if (existing.length > 0) {
      const goal = validated.goal ?? (existing[0].goal || 1);
      validated.completed = isLogCompleted(validated.count, goal);
    }
  }

  // Serialize entries if provided
  const updateData: any = { ...validated };
  if (updateData.entries) {
    updateData.entries = JSON.stringify(updateData.entries);
  }
  updateData.updatedAt = new Date();

  // Update in database
  const [updated] = await db
    .update(habitLogs)
    .set(updateData)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
    .returning();

  if (!updated) {
    throw new Error("Habit log not found");
  }

  return {
    ...updated,
    entries: Array.isArray(updated.entries) ? updated.entries : JSON.parse(updated.entries as string || '[]'),
  } as HabitLog;
}

/**
 * Delete a habit log
 */
export async function deleteHabitLog(
  habitId: string,
  date: string
): Promise<void> {
  await db
    .delete(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)));
}

/**
 * Get habit logs with calculated statistics
 */
export async function getHabitLogsWithStats(
  habitId: string
): Promise<HabitLogWithStats> {
  // Get all logs for the habit
  const logs = await getHabitLogs(habitId);

  // Convert to streak calculation format
  const streakLogs = logs.map((log) => ({
    date: log.date,
    completed: log.completed,
  }));

  // Calculate statistics
  const currentStreak = calculateCurrentStreak(streakLogs);
  const longestStreak = calculateLongestStreak(streakLogs);
  const completionRate7Day = getCompletionRate(streakLogs, 7);
  const completionRate30Day = getCompletionRate(streakLogs, 30);
  const totalCompletions = logs.filter((log) => log.completed).length;

  return {
    habitId,
    logs,
    currentStreak,
    longestStreak,
    completionRate7Day,
    completionRate30Day,
    totalCompletions,
  };
}

/**
 * Get today's log for a habit (helper for quick access)
 */
export async function getTodayLog(habitId: string): Promise<HabitLog | null> {
  const today = new Date().toISOString().split("T")[0];

  const [log] = await db
    .select()
    .from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, today)))
    .limit(1);

  return log ? ({
    ...log,
    entries: Array.isArray(log.entries) ? log.entries : JSON.parse(log.entries as string || '[]'),
  } as HabitLog) : null;
}
