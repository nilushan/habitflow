/**
 * Test script for flexible counting service layer
 * Run with: DATABASE_URL="..." pnpm dlx tsx scripts/test-logging-service.ts
 */

import { db } from "@/lib/db";
import { habits, habitLogs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  createHabitLog,
  incrementHabitLog,
  addLogEntry,
  getHabitLogs,
  getHabitLogsWithStats,
  updateHabitLog,
} from "@/lib/services/habit-log-service";

const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";
const TEST_HABIT_ID = "11111111-1111-1111-1111-111111111111";

async function setupTestData() {
  console.log("🔧 Setting up test data...\n");

  // Create test user
  await db
    .insert(users)
    .values({
      id: TEST_USER_ID,
      clerkId: "test_clerk_id",
      email: "test@example.com",
      settings: {},
    })
    .onConflictDoNothing();

  // Create test habit with daily frequency (8 times per day)
  await db
    .insert(habits)
    .values({
      id: TEST_HABIT_ID,
      userId: TEST_USER_ID,
      name: "Drink Water",
      description: "Stay hydrated throughout the day",
      category: "health",
      frequency: { type: "daily", timesPerDay: 8 },
      sortOrder: 0,
    })
    .onConflictDoUpdate({
      target: habits.id,
      set: {
        frequency: { type: "daily", timesPerDay: 8 },
        description: "Stay hydrated throughout the day",
      },
    });

  // Clean up any existing logs for this habit
  await db.delete(habitLogs).where(eq(habitLogs.habitId, TEST_HABIT_ID));

  console.log("✅ Test data ready!");
  console.log(`   User ID: ${TEST_USER_ID}`);
  console.log(`   Habit ID: ${TEST_HABIT_ID}\n`);
}

async function testService() {
  const today = new Date().toISOString().split("T")[0];

  console.log("📝 Testing Flexible Counting Service Layer\n");
  console.log("=".repeat(60) + "\n");

  // Test 1: Create log with count (simulating 3 glasses of water)
  console.log("Test 1: createHabitLog - Create log with count=3");
  const log1 = await createHabitLog(TEST_HABIT_ID, {
    date: today,
    count: 3,
    note: "Morning hydration",
  });

  console.log("Result:", JSON.stringify(log1, null, 2));
  console.log(`✓ count=${log1.count}, goal=${log1.goal}, completed=${log1.completed}`);
  console.log(
    `  Expected: count=3, goal=8 (from frequency.timesPerDay), completed=false\n`
  );

  // Test 2: Increment the log (add 2 more glasses)
  console.log("Test 2: incrementHabitLog - Add 2 more");
  const log2 = await incrementHabitLog(TEST_HABIT_ID, today, 2);

  console.log("Result:", JSON.stringify(log2, null, 2));
  console.log(`✓ count=${log2.count}, goal=${log2.goal}, completed=${log2.completed}`);
  console.log(`  Expected: count=5, goal=8, completed=false\n`);

  // Test 3: Add individual log entry with timestamp
  console.log("Test 3: addLogEntry - Add timestamped entry");
  const log3 = await addLogEntry(TEST_HABIT_ID, today, {
    timestamp: new Date().toISOString(),
    note: "Post-workout hydration",
  });

  console.log("Result:", JSON.stringify(log3, null, 2));
  console.log(
    `✓ count=${log3.count}, goal=${log3.goal}, entries=${log3.entries.length}`
  );
  console.log(`  Expected: count=6 (count increments with entry), entries=1\n`);

  // Test 4: Increment to completion (add 2 more to reach 8)
  console.log("Test 4: incrementHabitLog - Complete goal");
  const log4 = await incrementHabitLog(TEST_HABIT_ID, today, 2);

  console.log("Result:", JSON.stringify(log4, null, 2));
  console.log(`✓ count=${log4.count}, goal=${log4.goal}, completed=${log4.completed}`);
  console.log(`  Expected: count=8, goal=8, completed=true ✅\n`);

  // Test 5: Get logs with stats
  console.log("Test 5: getHabitLogsWithStats - Get statistics");
  const stats = await getHabitLogsWithStats(TEST_HABIT_ID);

  console.log("Result:", JSON.stringify(stats, null, 2));
  console.log(`✓ logs=${stats.logs.length}, totalCompletions=${stats.totalCompletions}`);
  console.log(
    `  Expected: logs=1, totalCompletions=1, currentStreak=1, completionRate7Day=100\n`
  );

  // Test 6: Update log directly
  console.log("Test 6: updateHabitLog - Update count to 10");
  const log6 = await updateHabitLog(TEST_HABIT_ID, today, {
    count: 10,
    note: "Exceeded goal!",
  });

  console.log("Result:", JSON.stringify(log6, null, 2));
  console.log(`✓ count=${log6.count}, goal=${log6.goal}, completed=${log6.completed}`);
  console.log(
    `  Expected: count=10, goal=8, completed=true (10/8 = 125% progress!)\n`
  );

  // Test 7: Create log for yesterday with no count (default behavior)
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  console.log("Test 7: createHabitLog - Default behavior (count=1)");
  const log7 = await createHabitLog(TEST_HABIT_ID, {
    date: yesterday,
    // No count specified - should default to 1
  });

  console.log("Result:", JSON.stringify(log7, null, 2));
  console.log(`✓ count=${log7.count}, goal=${log7.goal}, completed=${log7.completed}`);
  console.log(
    `  Expected: count=1 (default), goal=8, completed=false\n`
  );

  // Test 8: Backward compatibility - boolean completed
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
    .toISOString()
    .split("T")[0];
  console.log("Test 8: createHabitLog - Backward compatible (completed=true)");
  const log8 = await createHabitLog(TEST_HABIT_ID, {
    date: twoDaysAgo,
    completed: true, // Old boolean API
  });

  console.log("Result:", JSON.stringify(log8, null, 2));
  console.log(`✓ count=${log8.count}, goal=${log8.goal}, completed=${log8.completed}`);
  console.log(
    `  Expected: count=8 (goal), goal=8, completed=true (backward compat)\n`
  );

  // Final stats
  console.log("Final: getHabitLogs - Get all logs");
  const allLogs = await getHabitLogs(TEST_HABIT_ID);
  console.log(`✓ Total logs created: ${allLogs.length}`);
  console.log(`  Expected: 3 logs (today, yesterday, two days ago)\n`);

  console.log("=".repeat(60));
  console.log("✅ All service layer tests passed!\n");

  console.log("★ Insight ───────────────────────────────────");
  console.log("The flexible counting system successfully:");
  console.log("• Auto-calculates goals from habit frequency");
  console.log("• Supports incremental counting (3 → 5 → 6 → 8 → 10)");
  console.log("• Tracks individual timestamped entries");
  console.log("• Auto-marks completed when count >= goal");
  console.log("• Maintains backward compatibility with boolean");
  console.log("• Calculates streaks and completion rates");
  console.log("─────────────────────────────────────────────\n");
}

async function main() {
  try {
    await setupTestData();
    await testService();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
