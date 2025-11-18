import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  HabitLog,
  HabitLogWithStats,
  CreateHabitLogInput,
  UpdateHabitLogInput,
} from "@/types/habit-log";

/**
 * Fetch habit logs for a specific habit
 */
export function useHabitLogs(habitId: string) {
  return useQuery<HabitLog[]>({
    queryKey: ["habit-logs", habitId],
    queryFn: async () => {
      const response = await fetch(`/api/habits/${habitId}/logs`);
      if (!response.ok) {
        throw new Error("Failed to fetch habit logs");
      }
      return response.json();
    },
    enabled: !!habitId,
  });
}

/**
 * Fetch habit logs with statistics
 */
export function useHabitLogsWithStats(habitId: string) {
  return useQuery<HabitLogWithStats>({
    queryKey: ["habit-logs-stats", habitId],
    queryFn: async () => {
      const response = await fetch(`/api/habits/${habitId}/logs?stats=true`);
      if (!response.ok) {
        throw new Error("Failed to fetch habit logs with stats");
      }
      return response.json();
    },
    enabled: !!habitId,
  });
}

/**
 * Create or update a habit log
 */
export function useLogHabit(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateHabitLogInput) => {
      const response = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to log habit");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate both logs and stats queries
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-logs-stats", habitId] });
      // Also invalidate the habits list (in case we want to show streaks there)
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

/**
 * Update a specific habit log
 */
export function useUpdateHabitLog(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      updates,
    }: {
      date: string;
      updates: UpdateHabitLogInput;
    }) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update habit log");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-logs-stats", habitId] });
    },
  });
}

/**
 * Delete a habit log
 */
export function useDeleteHabitLog(habitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      const response = await fetch(`/api/habits/${habitId}/logs/${date}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete habit log");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habit-logs-stats", habitId] });
    },
  });
}

/**
 * Toggle today's habit completion (convenience hook)
 */
export function useToggleTodayHabit(habitId: string) {
  const logHabit = useLogHabit(habitId);
  const { data: logs } = useHabitLogs(habitId);

  const toggleToday = async () => {
    const today = new Date().toISOString().split("T")[0];

    // Find today's log if it exists
    const todayLog = logs?.find((log) => log.date === today);

    // Toggle the completion status
    await logHabit.mutateAsync({
      date: today,
      completed: !todayLog?.completed,
    });
  };

  return {
    toggleToday,
    isPending: logHabit.isPending,
    isCompleted: logs?.find(
      (log) => log.date === new Date().toISOString().split("T")[0]
    )?.completed,
  };
}
