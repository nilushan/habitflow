import { NextRequest, NextResponse } from "next/server";
import {
  updateHabitLog,
  deleteHabitLog,
} from "@/lib/services/habit-log-service";
import { UpdateHabitLogSchema } from "@/types/habit-log";
import { z } from "zod";

// PATCH /api/habits/[id]/logs/[date] - Update a specific habit log
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: habitId, date } = await params;
    const body = await request.json();

    // Validate request body
    const validated = UpdateHabitLogSchema.parse(body);

    // Update the log
    const log = await updateHabitLog(habitId, date, validated);

    return NextResponse.json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    if ((error as Error).message === "Habit log not found") {
      return NextResponse.json(
        { error: "Habit log not found" },
        { status: 404 }
      );
    }

    console.error("Failed to update habit log:", error);
    return NextResponse.json(
      { error: "Failed to update habit log" },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id]/logs/[date] - Delete a specific habit log
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: habitId, date } = await params;

    await deleteHabitLog(habitId, date);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete habit log:", error);
    return NextResponse.json(
      { error: "Failed to delete habit log" },
      { status: 500 }
    );
  }
}
