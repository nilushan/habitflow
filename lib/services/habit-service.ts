import { eq, and, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { habits } from "@/lib/db/schema";
import { CreateHabitSchema, UpdateHabitSchema } from "@/types/habit";
import type { CreateHabitInput, UpdateHabitInput, Habit } from "@/types/habit";

/**
 * Create a new habit for a user
 */
export async function createHabit(
  userId: string,
  input: CreateHabitInput
): Promise<Habit> {
  // Validate input
  const validated = CreateHabitSchema.parse(input);

  // Insert into database
  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      name: validated.name,
      description: validated.description || null,
      category: validated.category,
      frequency: validated.frequency,
    })
    .returning();

  if (!habit) {
    throw new Error("Failed to create habit");
  }

  return {
    ...habit,
    category: habit.category as any, // Type assertion for text column
    frequency: habit.frequency as any, // Type assertion for JSONB
  };
}

/**
 * Get all habits for a user
 */
export async function getHabitsByUserId(
  userId: string,
  options: { includeArchived?: boolean } = {}
): Promise<Habit[]> {
  const { includeArchived = false } = options;

  // Build where conditions
  const conditions = includeArchived
    ? eq(habits.userId, userId)
    : and(eq(habits.userId, userId), isNull(habits.archivedAt));

  const result = await db
    .select()
    .from(habits)
    .where(conditions)
    .orderBy(habits.sortOrder, habits.createdAt);

  return result.map((h) => ({
    ...h,
    category: h.category as any,
    frequency: h.frequency as any,
  }));
}

/**
 * Get a single habit by ID
 */
export async function getHabitById(
  habitId: string,
  userId: string
): Promise<Habit | null> {
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);

  if (!habit) {
    return null;
  }

  return {
    ...habit,
    category: habit.category as any,
    frequency: habit.frequency as any,
  };
}

/**
 * Update a habit
 */
export async function updateHabit(
  habitId: string,
  userId: string,
  updates: UpdateHabitInput
): Promise<Habit> {
  // Validate input
  const validated = UpdateHabitSchema.parse(updates);

  // Check if habit exists and belongs to user
  const existing = await getHabitById(habitId, userId);
  if (!existing) {
    throw new Error("Habit not found or access denied");
  }

  // Update in database
  const [updated] = await db
    .update(habits)
    .set({
      ...validated,
      updatedAt: new Date(),
    })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Failed to update habit");
  }

  return {
    ...updated,
    category: updated.category as any,
    frequency: updated.frequency as any,
  };
}

/**
 * Archive a habit (soft delete)
 */
export async function archiveHabit(
  habitId: string,
  userId: string
): Promise<Habit> {
  return updateHabit(habitId, userId, {
    archivedAt: new Date(),
  });
}

/**
 * Delete a habit permanently
 */
export async function deleteHabit(
  habitId: string,
  userId: string
): Promise<void> {
  // Check if habit exists and belongs to user
  const existing = await getHabitById(habitId, userId);
  if (!existing) {
    throw new Error("Habit not found or access denied");
  }

  // Delete from database
  await db
    .delete(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}
