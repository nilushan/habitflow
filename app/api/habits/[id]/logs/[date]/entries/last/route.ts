import { NextRequest, NextResponse } from "next/server";
import { removeLastLogEntry } from "@/lib/services/habit-log-service";

/**
 * DELETE /api/habits/[id]/logs/[date]/entries/last
 * Remove the most recent log entry from a habit log
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: habitId, date } = await params;

    const log = await removeLastLogEntry(habitId, date);

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("Error removing last entry:", error);

    if (error instanceof Error) {
      if (error.message === "Habit log not found") {
        return NextResponse.json(
          { error: "Habit log not found" },
          { status: 404 }
        );
      }
      if (error.message === "No entries to remove") {
        return NextResponse.json(
          { error: "No entries to remove" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to remove entry" },
      { status: 500 }
    );
  }
}
