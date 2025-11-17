import { Card } from "@/components/ui/card";

export default function CoachPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Coach</h1>
      </div>

      <Card className="p-6">
        <p className="text-gray-500">
          AI Coach will be implemented in Phase 7.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Coming soon: Personalized coaching and accountability
        </p>
      </Card>
    </div>
  );
}
