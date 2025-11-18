"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitList } from "@/components/habits/habit-list";
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useArchiveHabit,
} from "@/hooks/use-habits";
import type { Habit, CreateHabitInput } from "@/types/habit";

export default function HabitsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Fetch habits
  const { data: habits = [], isLoading, error } = useHabits();

  // Mutations
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const archiveHabit = useArchiveHabit();

  const handleCreateHabit = async (data: CreateHabitInput) => {
    try {
      await createHabit.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleUpdateHabit = async (data: CreateHabitInput) => {
    if (!editingHabit) return;

    try {
      await updateHabit.mutateAsync({
        id: editingHabit.id,
        updates: data,
      });
      setEditingHabit(null);
    } catch (error) {
      console.error("Failed to update habit:", error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to permanently delete this habit?")) {
      return;
    }

    try {
      await deleteHabit.mutateAsync(habitId);
    } catch (error) {
      console.error("Failed to delete habit:", error);
    }
  };

  const handleArchiveHabit = async (habitId: string) => {
    try {
      await archiveHabit.mutateAsync(habitId);
    } catch (error) {
      console.error("Failed to archive habit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] relative overflow-hidden">
      {/* Organic background elements - Enhanced visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 animate-blob-slow"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #d4847c 0%, #c17161 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 -left-40 w-80 h-80 rounded-full opacity-15 animate-blob animation-delay-4000"
          style={{
            background: 'radial-gradient(circle at 60% 50%, #8a9a8f 0%, #5f7367 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full opacity-12 animate-blob animation-delay-2000"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #c8b8a8 0%, transparent 60%)',
          }}
        />

        {/* Grain texture - Enhanced for organic feel */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {/* Decorative accent */}
              <div className="w-1.5 h-16 bg-gradient-to-b from-[#d4847c] via-[#c17161] to-[#8a9a8f] rounded-full" />
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold text-[#2d3134] tracking-tight">
                  My Habits
                </h1>
                <p className="text-lg text-[#6b6560] mt-2 font-light flex items-center gap-2">
                  <span>Build lasting habits, one day at a time</span>
                </p>
              </div>
            </div>
          </div>

          {/* Create Habit Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="group relative overflow-hidden bg-[#d4847c] hover:bg-[#c17161] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base rounded-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Habit
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl glass border-[#d4847c]/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#2d3134]">
                Create New Habit
              </DialogTitle>
              <DialogDescription className="text-[#6b6560]">
                Define a new habit to track. Be specific about what you want to achieve.
              </DialogDescription>
            </DialogHeader>
            <HabitForm
              onSubmit={handleCreateHabit}
              isSubmitting={createHabit.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Habit Dialog */}
      <Dialog
        open={!!editingHabit}
        onOpenChange={(open) => !open && setEditingHabit(null)}
      >
        <DialogContent className="max-w-2xl glass border-[#d4847c]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2d3134]">
              Edit Habit
            </DialogTitle>
            <DialogDescription className="text-[#6b6560]">
              Update your habit details and frequency.
            </DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <HabitForm
              onSubmit={handleUpdateHabit}
              isSubmitting={updateHabit.isPending}
              defaultValues={{
                name: editingHabit.name,
                description: editingHabit.description || "",
                category: editingHabit.category,
                frequency: editingHabit.frequency,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

        {/* Habit List */}
        <HabitList
          habits={habits}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditHabit}
          onDelete={handleDeleteHabit}
          onArchive={handleArchiveHabit}
        />
      </div>
    </div>
  );
}
