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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              My Habits
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Build lasting habits, one day at a time 🌱
            </p>
          </div>

          {/* Create Habit Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                + Create Habit
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Define a new habit to track. Be specific about what you want to
                achieve.
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
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
