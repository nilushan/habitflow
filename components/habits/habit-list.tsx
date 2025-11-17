"use client";

import { type Habit } from "@/types/habit";
import { HabitCard } from "./habit-card";

interface HabitListProps {
  habits: Habit[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
}

export function HabitList({
  habits,
  isLoading,
  error,
  onEdit,
  onDelete,
  onArchive,
}: HabitListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-semibold text-gray-700">Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3 bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-2xl">⚠️</p>
          <p className="text-red-700 font-bold text-lg">Error loading habits</p>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-xl p-12 max-w-lg">
          <p className="text-6xl">🌱</p>
          <p className="text-gray-900 font-bold text-2xl">No habits yet</p>
          <p className="text-gray-600 text-lg">
            Start your journey by creating your first habit!
          </p>
        </div>
      </div>
    );
  }

  // Group habits by category for better organization
  const groupedHabits = habits.reduce(
    (acc, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = [];
      }
      acc[habit.category].push(habit);
      return acc;
    },
    {} as Record<string, Habit[]>
  );

  return (
    <div className="space-y-10">
      {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
        <div key={category} className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold capitalize text-gray-900">
              {category}
            </h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
              {categoryHabits.length} {categoryHabits.length === 1 ? 'habit' : 'habits'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={onEdit}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
