"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useLogHabit, useHabitLogs } from "@/hooks/use-habit-logs";
import { useState, useEffect } from "react";

interface HabitCheckboxProps {
  habitId: string;
  date?: string; // Optional - defaults to today
  showDate?: boolean; // Show date label
  size?: "sm" | "md" | "lg";
}

export function HabitCheckbox({
  habitId,
  date,
  showDate = false,
  size = "md",
}: HabitCheckboxProps) {
  const targetDate = date || new Date().toISOString().split("T")[0];
  const { data: logs, isLoading } = useHabitLogs(habitId);
  const logHabit = useLogHabit(habitId);

  // Find the log for the target date
  const log = logs?.find((l) => l.date === targetDate);
  const [isChecked, setIsChecked] = useState(log?.completed || false);

  // Update local state when log data changes
  useEffect(() => {
    setIsChecked(log?.completed || false);
  }, [log?.completed]);

  const handleToggle = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue); // Optimistic update

    try {
      await logHabit.mutateAsync({
        date: targetDate,
        completed: newValue,
      });
    } catch (error) {
      // Revert on error
      setIsChecked(!newValue);
      console.error("Failed to toggle habit:", error);
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const isToday = targetDate === new Date().toISOString().split("T")[0];
  const isPast = new Date(targetDate) < new Date(new Date().toISOString().split("T")[0]);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleToggle}
        disabled={isLoading || logHabit.isPending}
        className={`${sizeClasses[size]} transition-all ${
          isChecked
            ? "bg-[#8a9a8f] border-[#8a9a8f]"
            : isPast
            ? "border-gray-300"
            : "border-[#d4847c]"
        }`}
        aria-label={`Mark habit as ${isChecked ? "incomplete" : "complete"} for ${targetDate}`}
      />
      {showDate && (
        <span
          className={`text-sm ${
            isToday
              ? "font-semibold text-[#2d3134]"
              : "text-[#6b6560]"
          }`}
        >
          {isToday ? "Today" : formatDate(targetDate)}
        </span>
      )}
    </div>
  );
}

// Helper to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  }
  if (dateStr === yesterday.toISOString().split("T")[0]) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
