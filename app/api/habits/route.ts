import { NextRequest, NextResponse } from "next/server";
import { createHabit, getHabitsByUserId } from "@/lib/services/habit-service";
import { CreateHabitSchema } from "@/types/habit";
import { ZodError } from "zod";

/**
 * GET /api/habits
 * Get all habits for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication (Clerk/NextAuth)
    // For now, use a mock user ID from header
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const includeArchived = searchParams.get("includeArchived") === "true";

    const habits = await getHabitsByUserId(userId, { includeArchived });

    return NextResponse.json({ habits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/habits
 * Create a new habit
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Replace with actual authentication
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validated = CreateHabitSchema.parse(body);

    const habit = await createHabit(userId, validated);

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
