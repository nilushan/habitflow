import { Card } from "@/components/ui/card";

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] relative overflow-hidden">
      {/* Organic background - Enhanced visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 right-20 w-72 h-72 rounded-full opacity-22 animate-blob-slow"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #c8b8a8 0%, transparent 70%)',
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
            <div className="w-1.5 h-16 bg-gradient-to-b from-[#c8b8a8] to-[#d4847c] rounded-full" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-[#2d3134] tracking-tight">
                AI Coach
              </h1>
              <p className="text-lg text-[#6b6560] mt-2 font-light">
                Your personalized habit coach
              </p>
            </div>
          </div>
        </div>

        {/* Chat Interface Preview */}
        <div className="animate-slide-up animation-delay-100">
          <Card className="border border-[#e8dfd5]/50 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#c8b8a8] via-[#d4847c] to-[#8a9a8f]" />

            {/* Chat Header */}
            <div className="p-6 border-b border-[#e8dfd5] flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#8a9a8f] rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#2d3134]">Coach Claude</h3>
                <p className="text-sm text-[#8a9a8f]">Always here to help</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 space-y-6 min-h-[400px] max-h-[500px] overflow-y-auto">
              {/* AI Message 1 */}
              <div className="flex gap-3 animate-slide-in-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="inline-block glass rounded-2xl rounded-tl-sm p-4 border border-[#8a9a8f]/20 max-w-md">
                    <p className="text-[#2d3134] leading-relaxed">
                      Hi there! 👋 I've noticed you've been doing great with your morning meditation habit. You've maintained a 14-day streak!
                    </p>
                  </div>
                  <p className="text-xs text-[#6b6560]/60 ml-1">9:24 AM</p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 justify-end animate-slide-in-right animation-delay-100">
                <div className="flex-1 space-y-2 flex flex-col items-end">
                  <div className="inline-block bg-gradient-to-br from-[#d4847c] to-[#c17161] rounded-2xl rounded-tr-sm p-4 max-w-md shadow-md">
                    <p className="text-white leading-relaxed">
                      Thank you! I'm finding it really helpful for my focus.
                    </p>
                  </div>
                  <p className="text-xs text-[#6b6560]/60 mr-1">9:25 AM</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-sm font-semibold">U</span>
                </div>
              </div>

              {/* AI Message 2 */}
              <div className="flex gap-3 animate-slide-in-left animation-delay-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="inline-block glass rounded-2xl rounded-tl-sm p-4 border border-[#8a9a8f]/20 max-w-md">
                    <p className="text-[#2d3134] leading-relaxed">
                      That's wonderful! Based on your journal entries, I've noticed meditation is positively affecting your work productivity too.
                    </p>
                    <div className="mt-3 p-3 bg-[#f5efe6] rounded-xl">
                      <p className="text-xs font-semibold text-[#5f7367] uppercase tracking-wide mb-1">Suggestion</p>
                      <p className="text-sm text-[#2d3134]">
                        Consider extending your session by 5 minutes this week? 🧘‍♂️
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6b6560]/60 ml-1">9:26 AM</p>
                </div>
              </div>

              {/* User Message 2 */}
              <div className="flex gap-3 justify-end animate-slide-in-right animation-delay-300">
                <div className="flex-1 space-y-2 flex flex-col items-end">
                  <div className="inline-block bg-gradient-to-br from-[#d4847c] to-[#c17161] rounded-2xl rounded-tr-sm p-4 max-w-md shadow-md">
                    <p className="text-white leading-relaxed">
                      Good idea! I'll try that tomorrow morning.
                    </p>
                  </div>
                  <p className="text-xs text-[#6b6560]/60 mr-1">9:27 AM</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white text-sm font-semibold">U</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#e8dfd5] bg-[#fafaf8]/50">
              <div className="flex gap-3">
                <div className="flex-1 bg-white border border-[#e8dfd5] rounded-2xl px-4 py-3 flex items-center opacity-60">
                  <p className="text-[#6b6560]/50 text-sm">Type your message...</p>
                </div>
                <button
                  disabled
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center shadow-md opacity-60"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="animate-fade-in animation-delay-200">
          <div className="glass rounded-2xl p-6 border border-[#c8b8a8]/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2d3134] mb-2">
              Coming in Phase 7
            </h3>
            <p className="text-[#6b6560] max-w-md mx-auto">
              Your AI coach will provide personalized guidance, accountability, and motivation
              based on your habit patterns and journal entries.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['24/7 support', 'Personalized advice', 'Habit insights', 'Privacy-focused'].map((feature) => (
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
