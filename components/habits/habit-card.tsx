"use client";

import { type Habit } from "@/types/habit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
}

const categoryColors = {
  health: "bg-green-100 text-green-900 border-green-300",
  work: "bg-blue-100 text-blue-900 border-blue-300",
  learning: "bg-purple-100 text-purple-900 border-purple-300",
  social: "bg-pink-100 text-pink-900 border-pink-300",
  other: "bg-gray-100 text-gray-900 border-gray-300",
} as const;

const categoryGradients = {
  health: "from-green-50 to-emerald-50",
  work: "from-blue-50 to-cyan-50",
  learning: "from-purple-50 to-violet-50",
  social: "from-pink-50 to-rose-50",
  other: "from-gray-50 to-slate-50",
} as const;

const categoryIcons = {
  health: "💪",
  work: "💼",
  learning: "📚",
  social: "👥",
  other: "🎯",
} as const;

export function HabitCard({ habit, onEdit, onDelete, onArchive }: HabitCardProps) {
  const formatFrequency = (frequency: Habit["frequency"]): string => {
    switch (frequency.type) {
      case "daily":
        return `${frequency.timesPerDay}x per day`;
      case "weekly":
        const days = frequency.daysOfWeek
          .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
          .join(", ");
        return `${days} (${frequency.timesPerDay}x per day)`;
      case "custom":
        return `${frequency.targetDays} days per ${frequency.perWeeks} week${frequency.perWeeks > 1 ? "s" : ""}`;
      default:
        return "Unknown frequency";
    }
  };

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border-2 overflow-hidden bg-gradient-to-br ${categoryGradients[habit.category]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl">
                {categoryIcons[habit.category]}
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 ${
                  categoryColors[habit.category]
                }`}
              >
                {habit.category.toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">{habit.name}</CardTitle>
            {habit.description && (
              <CardDescription className="mt-2 text-base text-gray-700">
                {habit.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Frequency Display */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-lg">📅</span>
              <span className="font-semibold">Frequency:</span>
              <span className="text-gray-700">{formatFrequency(habit.frequency)}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-600 space-y-1 bg-white/40 rounded-lg p-2">
            <p className="font-medium">Created: {new Date(habit.createdAt).toLocaleDateString()}</p>
            {habit.archivedAt && (
              <p className="text-amber-700 font-semibold">
                ⚠️ Archived: {new Date(habit.archivedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Actions */}
          {!habit.archivedAt && (
            <div className="flex gap-2 pt-3 border-t-2 border-gray-200">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(habit)}
                  className="flex-1 font-semibold hover:bg-white hover:shadow-md transition-all"
                >
                  ✏️ Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(habit.id)}
                  className="flex-1 font-semibold hover:bg-amber-50 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  📦 Archive
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(habit.id)}
                  className="flex-1 font-semibold hover:shadow-md transition-all"
                >
                  🗑️ Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
