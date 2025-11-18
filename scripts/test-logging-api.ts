/**
 * Test script for flexible counting API
 * Run with: pnpm tsx scripts/test-logging-api.ts
 */

import { db } from "@/lib/db";
import { habits, habitLogs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

async function testAPIs() {
  const today = new Date().toISOString().split("T")[0];
  const baseUrl = "http://localhost:3000/api/habits";

  console.log("📝 Testing Flexible Counting APIs\n");
  console.log("=".repeat(60) + "\n");

  // Test 1: Create log with count (simulating 3 glasses of water)
  console.log("Test 1: POST /api/habits/[id]/logs - Create log with count=3");
  const createResponse = await fetch(`${baseUrl}/${TEST_HABIT_ID}/logs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: today,
      count: 3,
      note: "Morning hydration",
    }),
  });

  const createData = await createResponse.json();
  console.log("Status:", createResponse.status);
  console.log("Response:", JSON.stringify(createData, null, 2));
  console.log(`Expected: count=3, goal=8, completed=false\n`);

  // Test 2: Increment the log (add 2 more glasses)
  console.log("Test 2: POST /api/habits/[id]/logs/increment - Add 2 more");
  const incrementResponse = await fetch(
    `${baseUrl}/${TEST_HABIT_ID}/logs/increment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        incrementBy: 2,
      }),
    }
  );

  const incrementData = await incrementResponse.json();
  console.log("Status:", incrementResponse.status);
  console.log("Response:", JSON.stringify(incrementData, null, 2));
  console.log(`Expected: count=5, goal=8, completed=false\n`);

  // Test 3: Add individual log entry with timestamp
  console.log(
    "Test 3: POST /api/habits/[id]/logs/[date]/entries - Add timestamped entry"
  );
  const entryResponse = await fetch(
    `${baseUrl}/${TEST_HABIT_ID}/logs/${today}/entries`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        note: "Post-workout hydration",
      }),
    }
  );

  const entryData = await entryResponse.json();
  console.log("Status:", entryResponse.status);
  console.log("Response:", JSON.stringify(entryData, null, 2));
  console.log(`Expected: count=6, entries array with 1 item\n`);

  // Test 4: Increment to completion (add 2 more to reach 8)
  console.log("Test 4: POST /api/habits/[id]/logs/increment - Complete goal");
  const completeResponse = await fetch(
    `${baseUrl}/${TEST_HABIT_ID}/logs/increment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        incrementBy: 2,
      }),
    }
  );

  const completeData = await completeResponse.json();
  console.log("Status:", completeResponse.status);
  console.log("Response:", JSON.stringify(completeData, null, 2));
  console.log(`Expected: count=8, goal=8, completed=true ✅\n`);

  // Test 5: Get logs with stats
  console.log("Test 5: GET /api/habits/[id]/logs?stats=true - Get statistics");
  const statsResponse = await fetch(
    `${baseUrl}/${TEST_HABIT_ID}/logs?stats=true`
  );

  const statsData = await statsResponse.json();
  console.log("Status:", statsResponse.status);
  console.log("Response:", JSON.stringify(statsData, null, 2));
  console.log(`Expected: logs array with stats (streak, completion rate)\n`);

  // Test 6: Update log directly
  console.log(
    "Test 6: PATCH /api/habits/[id]/logs/[date] - Update count to 10"
  );
  const updateResponse = await fetch(
    `${baseUrl}/${TEST_HABIT_ID}/logs/${today}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        count: 10,
        note: "Exceeded goal!",
      }),
    }
  );

  const updateData = await updateResponse.json();
  console.log("Status:", updateResponse.status);
  console.log("Response:", JSON.stringify(updateData, null, 2));
  console.log(`Expected: count=10, goal=8, completed=true (10/8 = 125%)\n`);

  console.log("=".repeat(60));
  console.log("✅ All API tests completed!\n");
}

async function main() {
  try {
    await setupTestData();
    await testAPIs();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
