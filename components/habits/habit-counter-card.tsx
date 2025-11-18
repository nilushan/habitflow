"use client";

import { useState } from "react";
import { MinusCircle, PlusCircle, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { HabitLog } from "@/types/habit-log";

interface HabitCounterCardProps {
  habit: Habit;
  log: HabitLog | null;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenDetail: () => void;
  disabled?: boolean;
}

/**
 * Compact habit counter card for Today view
 * Shows progress at a glance with quick actions
 */
export function HabitCounterCard({
  habit,
  log,
  onIncrement,
  onDecrement,
  onOpenDetail,
  disabled = false,
}: HabitCounterCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCount = log?.count ?? 0;
  const goal = log?.goal ?? 1;
  const progress = Math.min((currentCount / goal) * 100, 100);
  const isCompleted = currentCount >= goal;

  const handleIncrement = () => {
    if (disabled) return;
    setIsAnimating(true);
    onIncrement();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDecrement = () => {
    if (disabled || currentCount === 0) return;
    onDecrement();
  };

  // Get category color
  const categoryColors = {
    health: "bg-[#8a9a8f]",
    work: "bg-[#d4847c]",
    learning: "bg-[#c8b8a8]",
    social: "bg-[#b4a89a]",
    other: "bg-[#9b8d80]",
  };

  const categoryColor = categoryColors[habit.category as keyof typeof categoryColors] ?? categoryColors.other;

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "bg-white border-4 border-[#2d3134] rounded-2xl",
        "shadow-brutal transition-all duration-300",
        "hover:shadow-brutal-lg hover:-translate-y-1",
        isCompleted && "border-[#8a9a8f]"
      )}
    >
      {/* Category stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-2", categoryColor)} />

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Habit info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-[#2d3134] truncate">
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-[#6b6560] mt-1 line-clamp-1">
                {habit.description}
              </p>
            )}
          </div>

          {/* Completion badge */}
          {isCompleted && (
            <div className="flex-shrink-0 ml-3">
              <div className="bg-[#8a9a8f] text-white rounded-full p-2 animate-bounce">
                <Check className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#6b6560]">
              Progress
            </span>
            <span className="text-sm font-black text-[#2d3134]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-4 bg-[#e8dfd5] rounded-full overflow-hidden border-2 border-[#2d3134]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isCompleted ? "bg-[#8a9a8f]" : "bg-[#d4847c]"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Counter controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecrement}
              disabled={disabled || currentCount === 0}
              className={cn(
                "group/btn transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
              aria-label="Decrement"
            >
              <MinusCircle
                className={cn(
                  "w-10 h-10 transition-colors",
                  currentCount === 0
                    ? "text-gray-300"
                    : "text-[#d4847c] group-hover/btn:text-[#c17161]"
                )}
              />
            </button>

            <div className="flex flex-col items-center min-w-[80px]">
              <div
                className={cn(
                  "text-3xl font-black transition-all duration-300",
                  isAnimating && "scale-125",
                  isCompleted ? "text-[#8a9a8f]" : "text-[#d4847c]"
                )}
              >
                {currentCount}
              </div>
              <div className="text-sm font-medium text-[#6b6560]">
                / {goal}
              </div>
            </div>

            <button
              onClick={handleIncrement}
              disabled={disabled}
              className={cn(
                "group/btn transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
              aria-label="Increment"
            >
              <PlusCircle
                className={cn(
                  "w-10 h-10 transition-colors",
                  isCompleted
                    ? "text-[#8a9a8f] group-hover/btn:text-[#7a8a7f]"
                    : "text-[#d4847c] group-hover/btn:text-[#c17161]"
                )}
              />
            </button>
          </div>

          {/* View details button */}
          <button
            onClick={onOpenDetail}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-xl",
              "bg-[#f5efe6] border-2 border-[#2d3134]",
              "text-sm font-bold text-[#2d3134]",
              "transition-all duration-200",
              "hover:bg-[#e8dfd5] hover:shadow-sm",
              "active:scale-95"
            )}
          >
            Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Entry count */}
        {log && log.entries.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-dashed border-[#e8dfd5]">
            <div className="text-xs text-[#9b8d80] text-center">
              {log.entries.length} logged {log.entries.length === 1 ? "entry" : "entries"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
