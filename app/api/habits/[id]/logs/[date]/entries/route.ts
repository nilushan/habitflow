import { NextRequest, NextResponse } from "next/server";
import { addLogEntry } from "@/lib/services/habit-log-service";
import { z } from "zod";

// Schema for adding a log entry
const AddEntrySchema = z.object({
  timestamp: z.string(), // ISO datetime
  note: z.string().max(200, "Entry note must be 200 characters or less").optional(),
});

/**
 * POST /api/habits/[id]/logs/[date]/entries
 * Add a timestamped entry to a habit log
 * Creates a new log if one doesn't exist for the date
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: habitId, date } = await params;
    const body = await request.json();

    // Validate request body
    const validated = AddEntrySchema.parse(body);

    // Add the entry
    const log = await addLogEntry(habitId, date, validated);

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Failed to add log entry:", error);
    return NextResponse.json(
      { error: "Failed to add log entry" },
      { status: 500 }
    );
  }
}
