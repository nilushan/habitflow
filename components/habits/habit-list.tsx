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
      <div className="flex items-center justify-center py-24 animate-fade-in">
        <div className="text-center space-y-6 bg-white/80 backdrop-blur-lg border-2 border-dashed border-indigo-200 rounded-3xl p-16 max-w-xl shadow-2xl transform hover:scale-105 transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-20"></div>
            <p className="text-8xl animate-bounce relative">🌱</p>
          </div>
          <div className="space-y-3">
            <p className="text-gray-900 font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Journey Begins Here
            </p>
            <p className="text-gray-600 text-xl leading-relaxed">
              Create your first habit and start building<br />a better version of yourself!
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Click "Create Habit" to get started</span>
          </div>
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
    <div className="space-y-12">
      {Object.entries(groupedHabits).map(([category, categoryHabits], index) => (
        <div
          key={category}
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border border-gray-100">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <h3 className="text-2xl font-extrabold capitalize bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {category}
              </h3>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-xl text-sm font-bold shadow-sm border border-blue-100">
              {categoryHabits.length} {categoryHabits.length === 1 ? 'habit' : 'habits'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryHabits.map((habit, habitIndex) => (
              <div
                key={habit.id}
                className="animate-slide-up"
                style={{ animationDelay: `${(index * 100) + (habitIndex * 50)}ms` }}
              >
                <HabitCard
                  habit={habit}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onArchive={onArchive}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
