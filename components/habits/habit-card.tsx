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
    <Card className={`group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-[#e8dfd5]/60 overflow-hidden bg-white/90 backdrop-blur-sm relative animate-slide-up shadow-md ${categoryBackgrounds[habit.category]}`}>
      {/* Top accent bar - Enhanced */}
      <div className={`h-1.5 bg-gradient-to-r ${categoryGradients[habit.category]}`}></div>

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${categoryGradients[habit.category]} shadow-md flex items-center justify-center text-2xl transform group-hover:scale-105 transition-all duration-300`}>
                {categoryIcons[habit.category]}
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  categoryColors[habit.category]
                } transform group-hover:scale-105 transition-transform duration-300`}
              >
                {habit.category.toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#2d3134] leading-tight">{habit.name}</CardTitle>
            {habit.description && (
              <CardDescription className="mt-2 text-base text-[#6b6560] leading-relaxed">
                {habit.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-4">
          {/* Frequency Display */}
          <div className={`bg-gradient-to-r ${categoryBackgrounds[habit.category]} rounded-xl p-4 border-l-4 border-[${categoryGradients[habit.category].split(' ')[0].replace('from-', '')}] transform group-hover:scale-[1.01] transition-transform duration-300`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryGradients[habit.category]} flex items-center justify-center`}>
                <span className="text-sm">📅</span>
              </div>
              <div>
                <p className="text-xs text-[#6b6560]/70 uppercase tracking-wider font-medium">Frequency</p>
                <p className="text-sm font-semibold text-[#2d3134] mt-0.5">{formatFrequency(habit.frequency)}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-[#6b6560] bg-[#f5efe6]/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8a9a8f]"></span>
              <span>Created {new Date(habit.createdAt).toLocaleDateString()}</span>
            </div>
            {habit.archivedAt && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4847c] animate-pulse"></span>
                <span className="text-[#c17161] font-semibold">
                  Archived {new Date(habit.archivedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!habit.archivedAt && (
            <div className="flex gap-2 pt-4 border-t border-[#e8dfd5]">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(habit)}
                  className="flex-1 font-medium hover:bg-[#8a9a8f]/10 hover:border-[#8a9a8f] hover:text-[#5f7367] transition-all duration-200 rounded-xl"
                >
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(habit.id)}
                  className="flex-1 font-medium hover:bg-[#c8b8a8]/10 hover:border-[#c8b8a8] hover:text-[#6b6560] transition-all duration-200 rounded-xl"
                >
                  Archive
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(habit.id)}
                  className="flex-1 font-medium bg-[#d4847c]/10 text-[#c17161] border border-[#d4847c]/30 hover:bg-[#d4847c] hover:text-white transition-all duration-200 rounded-xl"
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
