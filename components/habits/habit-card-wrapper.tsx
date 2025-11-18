"use client";

import { useHabitLogs } from "@/hooks/use-habit-logs";
import { useTodayLog } from "@/hooks/use-habit-counter";
import { HabitCounterCard } from "./habit-counter-card";
import type { Habit } from "@/types/habit";

interface HabitCardWrapperProps {
  habit: Habit;
  today: string;
  onOpenDetail: (habitId: string) => void;
}

/**
 * Wrapper component that handles hooks for a single habit card
 * This ensures hooks are called consistently at the top level
 */
export function HabitCardWrapper({
  habit,
  today,
  onOpenDetail,
}: HabitCardWrapperProps) {
  const { data: logs } = useHabitLogs(habit.id);
  const { addEntry, removeLastEntry } = useTodayLog(habit.id);

  const todayLog = logs?.find((log) => log.date === today);

  const handleIncrement = () => {
    // Use addEntry to create a timestamped entry (synchronized with Quick Add)
    addEntry.mutate({
      habitId: habit.id,
      date: today,
      timestamp: new Date().toISOString(),
      // No note - this is a simple increment
    });
  };

  const handleDecrement = () => {
    const currentCount = todayLog?.count ?? 0;
    if (currentCount === 0) return;

    // Remove the most recent entry
    removeLastEntry.mutate({ habitId: habit.id, date: today });
  };

  return (
    <HabitCounterCard
      habit={habit}
      log={todayLog ?? null}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      onOpenDetail={() => onOpenDetail(habit.id)}
    />
  );
}
