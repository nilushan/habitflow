import { Card } from "@/components/ui/card";

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] relative overflow-hidden">
      {/* Organic background elements - Enhanced visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-25 animate-blob-slow"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #d4847c 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-48 h-48 rounded-full opacity-20 animate-blob animation-delay-4000"
          style={{
            background: 'radial-gradient(circle at 60% 50%, #8a9a8f 0%, transparent 70%)',
          }}
        />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
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

        {/* Preview Card - Writing Interface */}
        <div className="animate-slide-up animation-delay-100">
          <Card className="border border-[#e8dfd5]/50 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-[#d4847c] via-[#c8b8a8] to-[#8a9a8f]" />

            <div className="p-8 space-y-6">
              {/* Date and mood selector preview */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e8dfd5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center text-white font-semibold shadow-md">
                    18
                  </div>
                  <div>
                    <p className="text-sm text-[#6b6560] font-medium">November 2025</p>
                    <p className="text-xs text-[#6b6560]/60">Monday</p>
                  </div>
                </div>

                {/* Mood selector preview */}
                <div className="flex gap-2">
                  {['😊', '😌', '😐', '😔', '😴'].map((emoji, idx) => (
                    <button
                      key={idx}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 ${
                        idx === 0
                          ? 'bg-gradient-to-br from-[#d4847c] to-[#c17161] scale-110 shadow-md'
                          : 'bg-[#f5efe6] hover:bg-[#e8dfd5]'
                      }`}
                      disabled
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing area preview */}
              <div className="space-y-4">
                <div className="min-h-[300px] rounded-2xl bg-[#fafaf8] border border-[#e8dfd5]/30 p-6">
                  <div className="space-y-4 opacity-40">
                    <div className="h-4 bg-[#2d3134]/80 rounded-full w-3/4" />
                    <div className="h-4 bg-[#2d3134]/60 rounded-full w-full" />
                    <div className="h-4 bg-[#2d3134]/60 rounded-full w-5/6" />
                    <div className="h-4 bg-[#2d3134]/40 rounded-full w-2/3" />

                    <div className="pt-4">
                      <div className="h-4 bg-[#2d3134]/60 rounded-full w-4/5" />
                      <div className="h-4 bg-[#2d3134]/40 rounded-full w-3/4 mt-3" />
                    </div>
                  </div>
                </div>

                {/* AI insights preview */}
                <div className="glass rounded-2xl p-5 border border-[#8a9a8f]/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8a9a8f] to-[#5f7367] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-semibold text-[#5f7367] uppercase tracking-wide">
                        AI Insights
                      </p>
                      <div className="space-y-2 opacity-60">
                        <div className="h-3 bg-[#6b6560]/40 rounded-full w-full" />
                        <div className="h-3 bg-[#6b6560]/30 rounded-full w-5/6" />
                        <div className="h-3 bg-[#6b6560]/30 rounded-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <div className="animate-fade-in animation-delay-200">
          <div className="glass rounded-2xl p-6 border border-[#d4847c]/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2d3134] mb-2">
              Coming in Phase 4-5
            </h3>
            <p className="text-[#6b6560] max-w-md mx-auto">
              Auto-journaling with AI extraction will transform your daily reflections into
              actionable insights while preserving your privacy.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Privacy-first AI', 'Mood tracking', 'Smart insights', 'Habit connections'].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 rounded-full bg-[#f5efe6] text-[#6b6560] text-sm font-medium"
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
