"use client";

import { useHabitLogsWithStats } from "@/hooks/use-habit-logs";
import { useMemo } from "react";

interface HabitHeatmapProps {
  habitId: string;
  days?: number; // Number of days to show (default: 90)
}

export function HabitHeatmap({ habitId, days = 90 }: HabitHeatmapProps) {
  const { data, isLoading } = useHabitLogsWithStats(habitId);

  // Generate calendar data for the past N days
  const calendarData = useMemo(() => {
    if (!data) return [];

    const result = [];
    const today = new Date();
    const logMap = new Map(data.logs.map((log) => [log.date, log.completed]));

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const completed = logMap.get(dateStr);

      result.push({
        date: dateStr,
        completed: completed === true,
        isEmpty: completed === undefined,
      });
    }

    return result;
  }, [data, days]);

  if (isLoading) {
    return (
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Heatmap Grid */}
      <div className="flex gap-0.5 flex-wrap">
        {calendarData.map(({ date, completed, isEmpty }) => (
          <div
            key={date}
            className={`w-3 h-3 rounded-sm transition-all ${
              isEmpty
                ? "bg-gray-100 border border-gray-200"
                : completed
                ? "bg-[#8a9a8f] hover:bg-[#7a8a7f]"
                : "bg-[#f5dcd9] hover:bg-[#e5ccc9]"
            }`}
            title={`${date}: ${
              isEmpty ? "No data" : completed ? "Completed" : "Missed"
            }`}
          />
        ))}
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-[#6b6560] text-xs uppercase tracking-wide">
              Current Streak
            </div>
            <div className="text-2xl font-bold text-[#2d3134]">
              {data.currentStreak}
              <span className="text-sm font-normal text-[#6b6560] ml-1">
                days
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[#6b6560] text-xs uppercase tracking-wide">
              Best Streak
            </div>
            <div className="text-2xl font-bold text-[#2d3134]">
              {data.longestStreak}
              <span className="text-sm font-normal text-[#6b6560] ml-1">
                days
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[#6b6560] text-xs uppercase tracking-wide">
              7-Day Rate
            </div>
            <div className="text-2xl font-bold text-[#2d3134]">
              {data.completionRate7Day.toFixed(0)}
              <span className="text-sm font-normal text-[#6b6560] ml-1">%</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[#6b6560] text-xs uppercase tracking-wide">
              30-Day Rate
            </div>
            <div className="text-2xl font-bold text-[#2d3134]">
              {data.completionRate30Day.toFixed(0)}
              <span className="text-sm font-normal text-[#6b6560] ml-1">%</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-[#6b6560]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm" />
          <span>No data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#f5dcd9] rounded-sm" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#8a9a8f] rounded-sm" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}
