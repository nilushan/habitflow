"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Habit, CreateHabitInput, UpdateHabitInput } from "@/types/habit";

// Query keys
export const habitKeys = {
  all: ["habits"] as const,
  lists: () => [...habitKeys.all, "list"] as const,
  list: (filters: { includeArchived?: boolean }) =>
    [...habitKeys.lists(), filters] as const,
  details: () => [...habitKeys.all, "detail"] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
};

/**
 * Fetch all habits
 */
export function useHabits(options: { includeArchived?: boolean } = {}) {
  return useQuery({
    queryKey: habitKeys.list(options),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.includeArchived) {
        params.append("includeArchived", "true");
      }

      // TODO: Remove mock user header when auth is implemented
      const response = await fetch(`/api/habits?${params}`, {
        headers: {
          "x-user-id": "00000000-0000-0000-0000-000000000001", // TODO: Replace with real auth
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();
      return data.habits as Habit[];
    },
  });
}

/**
 * Fetch a single habit by ID
 */
export function useHabit(id: string | null) {
  return useQuery({
    queryKey: id ? habitKeys.detail(id) : [],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(`/api/habits/${id}`, {
        headers: {
          "x-user-id": "00000000-0000-0000-0000-000000000001", // TODO: Replace with real auth
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habit");
      }

      const data = await response.json();
      return data.habit as Habit;
    },
    enabled: !!id,
  });
}

/**
 * Create a new habit
 */
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateHabitInput) => {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "00000000-0000-0000-0000-000000000001", // TODO: Replace with real auth
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create habit");
      }

      const data = await response.json();
      return data.habit as Habit;
    },
    onSuccess: () => {
      // Invalidate and refetch habits list
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
    },
  });
}

/**
 * Update an existing habit
 */
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateHabitInput;
    }) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "00000000-0000-0000-0000-000000000001", // TODO: Replace with real auth
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update habit");
      }

      const data = await response.json();
      return data.habit as Habit;
    },
    onSuccess: (data) => {
      // Invalidate lists and update cached detail
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.setQueryData(habitKeys.detail(data.id), data);
    },
  });
}

/**
 * Delete a habit permanently
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": "00000000-0000-0000-0000-000000000001", // TODO: Replace with real auth
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete habit");
      }

      return id;
    },
    onSuccess: (id) => {
      // Invalidate lists and remove from cache
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) });
    },
  });
}

/**
 * Archive a habit (soft delete)
 */
export function useArchiveHabit() {
  const updateHabit = useUpdateHabit();

  return {
    ...updateHabit,
    mutate: (id: string) => {
      updateHabit.mutate({
        id,
        updates: { archivedAt: new Date() },
      });
    },
    mutateAsync: async (id: string) => {
      return updateHabit.mutateAsync({
        id,
        updates: { archivedAt: new Date() },
      });
    },
  };
}
