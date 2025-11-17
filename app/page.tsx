import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-4">HabitFlow</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Minimalist, AI-powered habit tracking with privacy-first architecture
        </p>

        <div className="space-y-4">
          <Link href="/habits">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-8">
            ✓ Phase 1 Complete: Project Setup
          </p>
          <p className="text-xs text-gray-400">
            Next.js 15 • TypeScript • Tailwind CSS • Drizzle ORM • Vitest • Playwright
          </p>
        </div>
      </div>
    </div>
  );
}
