import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { HabitLog } from "@/types/habit-log";

interface IncrementHabitLogParams {
  habitId: string;
  date: string;
  incrementBy?: number;
}

interface AddLogEntryParams {
  habitId: string;
  date: string;
  timestamp: string;
  note?: string;
}

/**
 * Hook for incrementing habit log count
 */
export function useIncrementHabitLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date, incrementBy = 1 }: IncrementHabitLogParams) => {
      const response = await fetch(`/api/habits/${habitId}/logs/increment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, incrementBy }),
      });

      if (!response.ok) {
        throw new Error("Failed to increment habit log");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      // Invalidate habit logs to refetch
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for decrementing habit log count
 * Uses the update endpoint to decrease count
 */
export function useDecrementHabitLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date, currentCount }: { habitId: string; date: string; currentCount: number }) => {
      const newCount = Math.max(0, currentCount - 1);

      const response = await fetch(`/api/habits/${habitId}/logs/${date}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: newCount }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrement habit log");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for adding timestamped log entry
 */
export function useAddLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date, timestamp, note }: AddLogEntryParams) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, note }),
      });

      if (!response.ok) {
        throw new Error("Failed to add log entry");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for removing the last log entry (used for decrement)
 */
export function useRemoveLastLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}/entries/last`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove log entry");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for updating a specific log entry
 */
export function useUpdateLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      entryId,
      note,
    }: {
      habitId: string;
      date: string;
      entryId: string;
      note?: string;
    }) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}/entries/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update log entry");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for deleting a specific log entry
 */
export function useDeleteLogEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      entryId,
    }: {
      habitId: string;
      date: string;
      entryId: string;
    }) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}/entries/${entryId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete log entry");
      }

      return response.json() as Promise<HabitLog>;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Hook for getting today's log for a habit
 */
export function useTodayLog(habitId: string) {
  const today = new Date().toISOString().split("T")[0];

  return {
    date: today,
    increment: useIncrementHabitLog(),
    decrement: useDecrementHabitLog(),
    addEntry: useAddLogEntry(),
    removeLastEntry: useRemoveLastLogEntry(),
  };
}
