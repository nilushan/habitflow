import { Card } from "@/components/ui/card";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Habits</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">
          Habit tracking will be implemented in Phase 2.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Coming soon: Create and track your daily habits
        </p>
      </Card>
    </div>
  );
}
