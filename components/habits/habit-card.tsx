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
  health: "bg-[#d4847c]/10 text-[#c17161] border-[#d4847c]/30",
  work: "bg-[#8a9a8f]/10 text-[#5f7367] border-[#8a9a8f]/30",
  learning: "bg-[#c8b8a8]/10 text-[#6b6560] border-[#c8b8a8]/30",
  social: "bg-[#d4847c]/10 text-[#c17161] border-[#d4847c]/30",
  other: "bg-[#e8dfd5]/10 text-[#6b6560] border-[#e8dfd5]/30",
} as const;

const categoryGradients = {
  health: "from-[#d4847c] to-[#c17161]",
  work: "from-[#8a9a8f] to-[#5f7367]",
  learning: "from-[#c8b8a8] to-[#6b6560]",
  social: "from-[#d4847c] to-[#c17161]",
  other: "from-[#e8dfd5] to-[#c8b8a8]",
} as const;

const categoryBackgrounds = {
  health: "bg-gradient-to-br from-[#d4847c]/5 to-[#c17161]/5",
  work: "bg-gradient-to-br from-[#8a9a8f]/5 to-[#5f7367]/5",
  learning: "bg-gradient-to-br from-[#c8b8a8]/5 to-[#6b6560]/5",
  social: "bg-gradient-to-br from-[#d4847c]/5 to-[#c17161]/5",
  other: "bg-gradient-to-br from-[#e8dfd5]/5 to-[#c8b8a8]/5",
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
    <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-4 border-[#2d3134] overflow-hidden bg-white relative animate-slide-up shadow-brutal">
      {/* BOLD top accent bar - THICKER */}
      <div className={`h-3 bg-gradient-to-r ${categoryGradients[habit.category]}`}></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* BIGGER, BOLDER ICON */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryGradients[habit.category]} border-3 border-[#2d3134] flex items-center justify-center text-4xl transform group-hover:scale-110 transition-all duration-300`}>
                {categoryIcons[habit.category]}
              </div>
              <span
                className={`text-sm font-bold px-4 py-2 rounded-full border-2 bg-white ${
                  categoryColors[habit.category]
                } transform group-hover:scale-105 transition-transform duration-300`}
              >
                {habit.category.toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-2xl font-black text-[#2d3134] leading-tight">{habit.name}</CardTitle>
            {habit.description && (
              <CardDescription className="mt-3 text-base text-[#6b6560] leading-relaxed font-medium">
                {habit.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-5">
          {/* Frequency Display - BOLD BOX */}
          <div className="bg-[#f5efe6] rounded-xl p-5 border-3 border-[#2d3134] transform group-hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryGradients[habit.category]} border-2 border-[#2d3134] flex items-center justify-center`}>
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-xs text-[#6b6560] uppercase tracking-wider font-bold">Frequency</p>
                <p className="text-base font-black text-[#2d3134] mt-1">{formatFrequency(habit.frequency)}</p>
              </div>
            </div>
          </div>

          {/* Metadata - BOLD */}
          <div className="flex items-center gap-4 text-sm text-[#6b6560] bg-[#f5efe6] rounded-xl p-4 border-2 border-[#e8dfd5] font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8a9a8f]"></span>
              <span className="font-bold">Created {new Date(habit.createdAt).toLocaleDateString()}</span>
            </div>
            {habit.archivedAt && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d4847c] animate-pulse"></span>
                <span className="text-[#c17161] font-black">
                  Archived {new Date(habit.archivedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Actions - CHUNKY BUTTONS */}
          {!habit.archivedAt && (
            <div className="flex gap-3 pt-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(habit)}
                  className="flex-1 font-bold border-2 border-[#8a9a8f] hover:bg-[#8a9a8f] hover:text-white transition-all duration-200 rounded-xl py-5"
                >
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(habit.id)}
                  className="flex-1 font-bold border-2 border-[#c8b8a8] hover:bg-[#c8b8a8] hover:text-white transition-all duration-200 rounded-xl py-5"
                >
                  Archive
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(habit.id)}
                  className="flex-1 font-bold bg-white text-[#c17161] border-2 border-[#d4847c] hover:bg-[#d4847c] hover:text-white transition-all duration-200 rounded-xl py-5"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
