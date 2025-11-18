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
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="text-center space-y-5 bg-white border-4 border-[#2d3134] rounded-3xl p-12 shadow-brutal">
          <div className="w-20 h-20 border-6 border-[#d4847c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-black text-[#2d3134]">Loading your habits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 animate-fade-in">
        <div className="text-center space-y-4 bg-white border-4 border-[#d4847c] rounded-3xl p-10 max-w-md shadow-brutal">
          <p className="text-5xl">⚠️</p>
          <p className="text-[#c17161] font-black text-2xl">Error loading habits</p>
          <p className="text-base text-[#6b6560] font-bold">{error.message}</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 animate-fade-in">
        <div className="text-center space-y-7 bg-white border-4 border-[#2d3134] rounded-3xl p-16 max-w-xl shadow-brutal transform hover:scale-105 transition-all duration-500">
          <div className="relative">
            <p className="text-9xl animate-float relative">🌱</p>
          </div>
          <div className="space-y-4">
            <p className="text-[#2d3134] font-black text-4xl">
              Your Journey Begins Here
            </p>
            <p className="text-[#6b6560] text-xl leading-relaxed font-medium">
              Create your first habit and start building<br />a better version of yourself!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 text-base text-[#6b6560] pt-4 bg-[#f5efe6] rounded-2xl p-4 border-2 border-[#e8dfd5]">
            <span className="w-3 h-3 rounded-full bg-[#d4847c] animate-pulse"></span>
            <span className="font-bold">Click "Create Habit" to get started</span>
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
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-brutal border-3 border-[#2d3134]">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#d4847c] to-[#8a9a8f]"></div>
              <h3 className="text-3xl font-black capitalize text-[#2d3134]">
                {category}
              </h3>
            </div>
            <span className="px-5 py-3 bg-[#f5efe6] text-[#2d3134] rounded-xl text-sm font-black border-2 border-[#e8dfd5]">
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
