import { NextRequest, NextResponse } from "next/server";
import {
  createHabitLog,
  getHabitLogs,
  getHabitLogsWithStats,
} from "@/lib/services/habit-log-service";
import { CreateHabitLogSchema } from "@/types/habit-log";
import { z } from "zod";

// GET /api/habits/[id]/logs - Get all logs for a habit
// Optional query param: ?stats=true to include statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params;

    // Check if stats are requested
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get("stats") === "true";

    if (includeStats) {
      const logsWithStats = await getHabitLogsWithStats(habitId);
      return NextResponse.json(logsWithStats);
    }

    const logs = await getHabitLogs(habitId);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Failed to fetch habit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit logs" },
      { status: 500 }
    );
  }
}

// POST /api/habits/[id]/logs - Create or update a habit log
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = CreateHabitLogSchema.parse(body);

    // Create or update the log
    const log = await createHabitLog(habitId, validated);

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Failed to create habit log:", error);
    return NextResponse.json(
      { error: "Failed to create habit log" },
      { status: 500 }
    );
  }
}
