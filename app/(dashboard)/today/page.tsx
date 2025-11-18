"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { useHabitLogs } from "@/hooks/use-habit-logs";
import { useTodayLog } from "@/hooks/use-habit-counter";
import { useUpdateLogEntry, useDeleteLogEntry } from "@/hooks/use-habit-counter";
import { HabitCardWrapper } from "@/components/habits/habit-card-wrapper";
import { HabitCounter } from "@/components/habits/habit-counter";
import { LogEntryList } from "@/components/habits/log-entry-list";
import { AddLogEntryForm } from "@/components/habits/add-log-entry-form";
import { Calendar, TrendingUp, Target, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TodayPage() {
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const today = new Date().toISOString().split("T")[0];
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  // Get logs only for selected habit (to avoid hook issues)
  const { data: selectedHabitLogs } = useHabitLogs(selectedHabitId ?? "");
  const selectedTodayLog = selectedHabitLogs?.find((log) => log.date === today);

  const { addEntry, removeLastEntry } = useTodayLog(selectedHabitId ?? "");
  const updateEntry = useUpdateLogEntry();
  const deleteEntry = useDeleteLogEntry();

  const handleIncrement = () => {
    if (!selectedHabitId) return;
    // Use addEntry to create a timestamped entry (same as Quick Add)
    addEntry.mutate({
      habitId: selectedHabitId,
      date: today,
      timestamp: new Date().toISOString(),
      // No note - this is a simple increment
    });
  };

  const handleDecrement = () => {
    if (!selectedHabitId) return;
    const currentCount = selectedTodayLog?.count ?? 0;
    if (currentCount === 0) return;

    // Remove the most recent entry
    removeLastEntry.mutate({ habitId: selectedHabitId, date: today });
  };

  const handleAddEntry = (note?: string) => {
    if (!selectedHabitId) return;
    addEntry.mutate({
      habitId: selectedHabitId,
      date: today,
      timestamp: new Date().toISOString(),
      note,
    });
  };

  const handleUpdateEntry = (entryId: string, note?: string) => {
    if (!selectedHabitId) return;
    updateEntry.mutate({
      habitId: selectedHabitId,
      date: today,
      entryId,
      note,
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!selectedHabitId) return;
    deleteEntry.mutate({
      habitId: selectedHabitId,
      date: today,
      entryId,
    });
  };

  const totalHabits = habits.length;
  // Note: We can't calculate completed count without fetching all logs
  // This would require a server component or different data structure
  const completionRate = 0; // Placeholder

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f5efe6 0%, #fafaf8 50%, #e8dfd5 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d4847c]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#8a9a8f]/20 rounded-3xl rotate-12 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-24 bg-gradient-to-b from-[#d4847c] to-[#8a9a8f] rounded-full" />
            <div>
              <h1 className="text-6xl font-black text-[#2d3134] tracking-tight">
                Today
              </h1>
              <p className="text-xl text-[#6b6560] mt-2 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-4">
            <div className={cn(
              "flex-1 bg-white border-4 border-[#2d3134] rounded-2xl p-6",
              "shadow-brutal"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#6b6560]">Total Habits</div>
                  <div className="text-4xl font-black text-[#2d3134] mt-1">
                    {totalHabits}
                  </div>
                </div>
                <TrendingUp className="w-10 h-10 text-[#d4847c]" />
              </div>
            </div>

            <div className={cn(
              "flex-1 bg-white border-4 border-[#2d3134] rounded-2xl p-6",
              "shadow-brutal"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#6b6560]">Track Your Progress</div>
                  <div className="text-lg font-black text-[#2d3134] mt-1">
                    Start logging!
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#8a9a8f] flex items-center justify-center">
                  <div className="text-2xl">✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits grid */}
        {habitsLoading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-6 border-[#d4847c] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xl font-black text-[#2d3134] mt-4">Loading your habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20 bg-white border-4 border-[#2d3134] rounded-3xl shadow-brutal">
            <p className="text-xl font-black text-[#2d3134]">No habits yet!</p>
            <p className="text-[#6b6560] mt-2">Create your first habit to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCardWrapper
                key={habit.id}
                habit={habit}
                today={today}
                onOpenDetail={setSelectedHabitId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedHabitId} onOpenChange={() => setSelectedHabitId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedHabit && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black text-[#2d3134]">
                  {selectedHabit.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Habit Info */}
                {selectedHabit.description && (
                  <div className="bg-[#f5efe6] border-2 border-[#2d3134] rounded-xl p-4">
                    <p className="text-sm text-[#6b6560]">{selectedHabit.description}</p>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border-2 border-[#2d3134] rounded-xl p-4 text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-[#d4847c]" />
                    <div className="text-2xl font-black text-[#2d3134]">
                      {selectedTodayLog?.goal ?? 1}
                    </div>
                    <div className="text-xs font-semibold text-[#6b6560]">Goal</div>
                  </div>

                  <div className="bg-white border-2 border-[#2d3134] rounded-xl p-4 text-center">
                    <Flame className="w-6 h-6 mx-auto mb-2 text-[#d4847c]" />
                    <div className="text-2xl font-black text-[#2d3134]">
                      {selectedTodayLog?.count ?? 0}
                    </div>
                    <div className="text-xs font-semibold text-[#6b6560]">Completed</div>
                  </div>

                  <div className="bg-white border-2 border-[#2d3134] rounded-xl p-4 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-[#8a9a8f]" />
                    <div className="text-2xl font-black text-[#2d3134]">
                      {selectedTodayLog?.entries.length ?? 0}
                    </div>
                    <div className="text-xs font-semibold text-[#6b6560]">Entries</div>
                  </div>
                </div>

                {/* Counter */}
                <div className="flex justify-center">
                  <HabitCounter
                    habitId={selectedHabit.id}
                    habitName={selectedHabit.name}
                    currentCount={selectedTodayLog?.count ?? 0}
                    goal={selectedTodayLog?.goal ?? 1}
                    date={today}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                  />
                </div>

                {/* Add Entry Form */}
                <div className="border-t-2 border-dashed border-[#e8dfd5] pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-[#2d3134] mb-2">
                      Log a Completion
                    </h3>
                    <p className="text-sm text-[#6b6560]">
                      Add a timestamped entry with optional notes
                    </p>
                  </div>
                  <AddLogEntryForm onAdd={handleAddEntry} />
                </div>

                {/* Log entries */}
                <div className="border-t-2 border-dashed border-[#e8dfd5] pt-6">
                  <LogEntryList
                    entries={selectedTodayLog?.entries ?? []}
                    onUpdateEntry={handleUpdateEntry}
                    onDeleteEntry={handleDeleteEntry}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
