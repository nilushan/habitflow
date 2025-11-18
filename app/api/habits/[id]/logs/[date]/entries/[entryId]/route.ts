import { NextRequest, NextResponse } from "next/server";
import { updateLogEntry, deleteLogEntry } from "@/lib/services/habit-log-service";
import { z } from "zod";

const UpdateEntrySchema = z.object({
  note: z.string().max(200).optional(),
});

/**
 * PATCH /api/habits/[id]/logs/[date]/entries/[entryId]
 * Update a specific log entry's note
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string; entryId: string }> }
) {
  try {
    const { id: habitId, date, entryId } = await params;
    const body = await request.json();
    const validated = UpdateEntrySchema.parse(body);

    const log = await updateLogEntry(habitId, date, entryId, validated.note);

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("Error updating log entry:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "Habit log not found" || error.message === "Entry not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/habits/[id]/logs/[date]/entries/[entryId]
 * Delete a specific log entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string; entryId: string }> }
) {
  try {
    const { id: habitId, date, entryId } = await params;

    const log = await deleteLogEntry(habitId, date, entryId);

    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error("Error deleting log entry:", error);

    if (error instanceof Error) {
      if (error.message === "Habit log not found" || error.message === "Entry not found") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
