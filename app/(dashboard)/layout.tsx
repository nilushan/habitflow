import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              HabitFlow
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/habits"
                className="text-sm hover:underline underline-offset-4"
              >
                Habits
              </Link>
              <Link
                href="/journal"
                className="text-sm hover:underline underline-offset-4"
              >
                Journal
              </Link>
              <Link
                href="/insights"
                className="text-sm hover:underline underline-offset-4"
              >
                Insights
              </Link>
              <Link
                href="/coach"
                className="text-sm hover:underline underline-offset-4"
              >
                Coach
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
          HabitFlow - Privacy-first habit tracking with AI insights
        </div>
      </footer>
    </div>
  );
}
