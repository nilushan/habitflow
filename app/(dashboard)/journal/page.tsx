import { Card } from "@/components/ui/card";

export default function JournalPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5efe6 0%, #fafaf8 50%, #e8dfd5 100%)'
      }}
    >
      {/* BOLD Geometric Accents - SOLID COLORS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right sage circle - SOLID */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#8a9a8f] rounded-full" />

        {/* Bottom left terracotta square - SOLID */}
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#d4847c] rounded-3xl rotate-12" />

        {/* Middle accent stripe */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8b8a8] to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-[#d4847c] to-[#8a9a8f] rounded-full" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-[#2d3134] tracking-tight">
                Journal
              </h1>
              <p className="text-lg text-[#6b6560] mt-2 font-light">
                Daily reflections with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Preview Card - Writing Interface - BOLD */}
        <div className="animate-slide-up animation-delay-100">
          <Card className="border-4 border-[#2d3134] bg-white shadow-brutal overflow-hidden">
            {/* Top accent - THICKER */}
            <div className="h-3 bg-gradient-to-r from-[#d4847c] via-[#c8b8a8] to-[#8a9a8f]" />

            <div className="p-8 space-y-8">
              {/* Date and mood selector preview - BOLDER */}
              <div className="flex items-center justify-between pb-6 border-b-3 border-[#e8dfd5]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4847c] to-[#c17161] border-3 border-[#2d3134] flex items-center justify-center text-white font-black text-xl shadow-md">
                    18
                  </div>
                  <div>
                    <p className="text-base text-[#2d3134] font-bold">November 2025</p>
                    <p className="text-sm text-[#6b6560] font-medium">Monday</p>
                  </div>
                </div>

                {/* Mood selector preview - BIGGER */}
                <div className="flex gap-3">
                  {['😊', '😌', '😐', '😔', '😴'].map((emoji, idx) => (
                    <button
                      key={idx}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 border-2 ${
                        idx === 0
                          ? 'bg-gradient-to-br from-[#d4847c] to-[#c17161] border-[#2d3134] scale-110 shadow-lg'
                          : 'bg-[#f5efe6] border-[#e8dfd5] hover:bg-[#e8dfd5] hover:border-[#2d3134]'
                      }`}
                      disabled
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing area preview - BOLD BORDERS */}
              <div className="space-y-6">
                <div className="min-h-[300px] rounded-2xl bg-[#fafaf8] border-3 border-[#2d3134] p-8">
                  <div className="space-y-5 opacity-50">
                    <div className="h-5 bg-[#2d3134] rounded-full w-3/4" />
                    <div className="h-5 bg-[#6b6560] rounded-full w-full" />
                    <div className="h-5 bg-[#6b6560] rounded-full w-5/6" />
                    <div className="h-5 bg-[#6b6560]/60 rounded-full w-2/3" />

                    <div className="pt-6">
                      <div className="h-5 bg-[#6b6560] rounded-full w-4/5" />
                      <div className="h-5 bg-[#6b6560]/60 rounded-full w-3/4 mt-4" />
                    </div>
                  </div>
                </div>

                {/* AI insights preview - BOLD */}
                <div className="bg-[#f5efe6] rounded-2xl p-6 border-3 border-[#2d3134]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8a9a8f] to-[#5f7367] border-2 border-[#2d3134] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-black text-[#2d3134] uppercase tracking-wide">
                        AI Insights
                      </p>
                      <div className="space-y-3 opacity-60">
                        <div className="h-4 bg-[#6b6560] rounded-full w-full" />
                        <div className="h-4 bg-[#6b6560] rounded-full w-5/6" />
                        <div className="h-4 bg-[#6b6560] rounded-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Notice - BOLD */}
        <div className="animate-fade-in animation-delay-200">
          <div className="bg-white rounded-3xl p-10 border-4 border-[#2d3134] text-center shadow-brutal">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] border-3 border-[#2d3134] mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-[#2d3134] mb-4">
              Coming in Phase 4-5
            </h3>
            <p className="text-[#6b6560] text-lg font-medium max-w-md mx-auto leading-relaxed">
              Auto-journaling with AI extraction will transform your daily reflections into
              actionable insights while preserving your privacy.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Privacy-first AI', 'Mood tracking', 'Smart insights', 'Habit connections'].map((feature) => (
                <span
                  key={feature}
                  className="px-5 py-3 rounded-xl bg-[#f5efe6] border-2 border-[#e8dfd5] text-[#2d3134] text-sm font-bold"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
