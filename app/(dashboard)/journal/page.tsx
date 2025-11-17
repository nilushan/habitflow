import { Card } from "@/components/ui/card";

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journal</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">
          Auto-journaling will be implemented in Phase 4-5.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Coming soon: Daily reflections with AI extraction
        </p>
      </Card>
    </div>
  );
}
