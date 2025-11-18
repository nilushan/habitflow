import { NextRequest, NextResponse } from "next/server";
import { incrementHabitLog } from "@/lib/services/habit-log-service";
import { z } from "zod";

// Schema for increment request
const IncrementLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  incrementBy: z.number().int().min(1).default(1),
});

/**
 * POST /api/habits/[id]/logs/increment
 * Convenience endpoint to increment a habit log count
 * Creates a new log if one doesn't exist for the date
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = IncrementLogSchema.parse(body);

    // Increment the log
    const log = await incrementHabitLog(
      habitId,
      validated.date,
      validated.incrementBy
    );

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Failed to increment habit log:", error);
    return NextResponse.json(
      { error: "Failed to increment habit log" },
      { status: 500 }
    );
  }
}
