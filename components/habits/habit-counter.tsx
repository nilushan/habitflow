"use client";

import { useState } from "react";
import { MinusCircle, PlusCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCounterProps {
  habitId: string;
  habitName: string;
  currentCount: number;
  goal: number;
  date: string;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

/**
 * Interactive counter component for tracking habit completions
 * Features:
 * - Visual progress ring
 * - Increment/decrement controls
 * - Completion celebration
 * - Smooth animations
 */
export function HabitCounter({
  habitId,
  habitName,
  currentCount,
  goal,
  date,
  onIncrement,
  onDecrement,
  disabled = false,
}: HabitCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = Math.min((currentCount / goal) * 100, 100);
  const isCompleted = currentCount >= goal;
  const isOverachieving = currentCount > goal;

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

  // Calculate stroke dasharray for progress ring
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress Ring */}
      <div className="relative">
        {/* Background circle */}
        <svg
          width="180"
          height="180"
          className="transform -rotate-90"
        >
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e8dfd5"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={isCompleted ? "#8a9a8f" : "#d4847c"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={cn(
              "text-5xl font-bold transition-all duration-300",
              isAnimating && "scale-125",
              isCompleted ? "text-[#8a9a8f]" : "text-[#d4847c]"
            )}
          >
            {currentCount}
          </div>
          <div className="text-lg text-[#6b6560] font-medium">
            / {goal}
          </div>
          {isCompleted && (
            <div className="absolute -top-2 -right-2 bg-[#8a9a8f] text-white rounded-full p-2 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleDecrement}
          disabled={disabled || currentCount === 0}
          className={cn(
            "group relative transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
          aria-label="Decrement count"
        >
          <MinusCircle
            className={cn(
              "w-12 h-12 transition-colors",
              currentCount === 0
                ? "text-gray-300"
                : "text-[#d4847c] group-hover:text-[#c17161]"
            )}
          />
        </button>

        <div className="flex flex-col items-center min-w-[100px]">
          <div className="text-sm font-medium text-[#6b6560]">
            {isOverachieving ? "Overachieving! 🎉" : isCompleted ? "Goal reached! ✨" : "Keep going!"}
          </div>
          <div className="text-xs text-[#9b8d80] mt-1">
            {Math.round(progress)}% complete
          </div>
        </div>

        <button
          onClick={handleIncrement}
          disabled={disabled}
          className={cn(
            "group relative transition-all duration-200",
            "hover:scale-110 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
          aria-label="Increment count"
        >
          <PlusCircle
            className={cn(
              "w-12 h-12 transition-colors",
              isCompleted
                ? "text-[#8a9a8f] group-hover:text-[#7a8a7f]"
                : "text-[#d4847c] group-hover:text-[#c17161]"
            )}
          />
        </button>
      </div>

      {/* Progress bar (mobile-friendly alternative) */}
      <div className="w-full max-w-xs md:hidden">
        <div className="h-3 bg-[#e8dfd5] rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isCompleted ? "bg-[#8a9a8f]" : "bg-[#d4847c]"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
