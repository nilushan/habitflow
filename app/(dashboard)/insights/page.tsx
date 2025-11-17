import { Card } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Insights</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">
          Smart insights will be implemented in Phase 6.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Coming soon: Weekly reports with AI-powered habit analysis
        </p>
      </Card>
    </div>
  );
}
