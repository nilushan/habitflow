import { Card } from "@/components/ui/card";

export default function CoachPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5efe6 0%, #fafaf8 50%, #e8dfd5 100%)'
      }}
    >
      {/* BOLD Geometric Accents - SOLID COLORS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top right neutral circle - SOLID */}
        <div className="absolute -top-28 -right-28 w-88 h-88 bg-[#c8b8a8] rounded-full" />

        {/* Bottom left terracotta square - SOLID */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#d4847c] rounded-3xl rotate-6" />

        {/* Middle accent stripe */}
        <div className="absolute top-2/3 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#8a9a8f] to-transparent" />
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
          <Card className="border-4 border-[#2d3134] bg-white shadow-brutal overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-[#c8b8a8] via-[#d4847c] to-[#8a9a8f]" />

            {/* Chat Header - BOLD */}
            <div className="p-8 border-b-3 border-[#e8dfd5] flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] border-3 border-[#2d3134] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                {/* Online indicator - BIGGER */}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#8a9a8f] rounded-full border-3 border-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#2d3134]">Coach Claude</h3>
                <p className="text-sm text-[#8a9a8f] font-bold">Always here to help</p>
              </div>
            </div>

            {/* Chat Messages - BOLD BUBBLES */}
            <div className="p-8 space-y-8 min-h-[400px] max-h-[500px] overflow-y-auto">
              {/* AI Message 1 - BOLD */}
              <div className="flex gap-4 animate-slide-in-left">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] border-2 border-[#2d3134] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="inline-block bg-[#f5efe6] border-3 border-[#2d3134] rounded-2xl rounded-tl-sm p-5 max-w-md shadow-md">
                    <p className="text-[#2d3134] leading-relaxed font-medium">
                      Hi there! 👋 I've noticed you've been doing great with your morning meditation habit. You've maintained a 14-day streak!
                    </p>
                  </div>
                  <p className="text-sm text-[#6b6560] ml-2 font-bold">9:24 AM</p>
                </div>
              </div>

              {/* User Message - BOLD */}
              <div className="flex gap-4 justify-end animate-slide-in-right animation-delay-100">
                <div className="flex-1 space-y-2 flex flex-col items-end">
                  <div className="inline-block bg-gradient-to-br from-[#d4847c] to-[#c17161] border-3 border-[#2d3134] rounded-2xl rounded-tr-sm p-5 max-w-md shadow-md">
                    <p className="text-white leading-relaxed font-medium">
                      Thank you! I'm finding it really helpful for my focus.
                    </p>
                  </div>
                  <p className="text-sm text-[#6b6560] mr-2 font-bold">9:25 AM</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] border-2 border-[#2d3134] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-base font-black">U</span>
                </div>
              </div>

              {/* AI Message 2 - BOLD WITH SUGGESTION */}
              <div className="flex gap-4 animate-slide-in-left animation-delay-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] border-2 border-[#2d3134] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="inline-block bg-[#f5efe6] border-3 border-[#2d3134] rounded-2xl rounded-tl-sm p-5 max-w-md shadow-md">
                    <p className="text-[#2d3134] leading-relaxed font-medium">
                      That's wonderful! Based on your journal entries, I've noticed meditation is positively affecting your work productivity too.
                    </p>
                    <div className="mt-4 p-4 bg-white rounded-xl border-2 border-[#8a9a8f]">
                      <p className="text-xs font-black text-[#5f7367] uppercase tracking-wide mb-2">Suggestion</p>
                      <p className="text-base text-[#2d3134] font-bold">
                        Consider extending your session by 5 minutes this week? 🧘‍♂️
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#6b6560] ml-2 font-bold">9:26 AM</p>
                </div>
              </div>

              {/* User Message 2 - BOLD */}
              <div className="flex gap-4 justify-end animate-slide-in-right animation-delay-300">
                <div className="flex-1 space-y-2 flex flex-col items-end">
                  <div className="inline-block bg-gradient-to-br from-[#d4847c] to-[#c17161] border-3 border-[#2d3134] rounded-2xl rounded-tr-sm p-5 max-w-md shadow-md">
                    <p className="text-white leading-relaxed font-medium">
                      Good idea! I'll try that tomorrow morning.
                    </p>
                  </div>
                  <p className="text-sm text-[#6b6560] mr-2 font-bold">9:27 AM</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4847c] to-[#c17161] border-2 border-[#2d3134] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-base font-black">U</span>
                </div>
              </div>
            </div>

            {/* Input Area - BOLD */}
            <div className="p-6 border-t-3 border-[#e8dfd5] bg-[#fafaf8]">
              <div className="flex gap-4">
                <div className="flex-1 bg-white border-3 border-[#2d3134] rounded-2xl px-6 py-4 flex items-center opacity-60">
                  <p className="text-[#6b6560] text-base font-medium">Type your message...</p>
                </div>
                <button
                  disabled
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4847c] to-[#c17161] border-3 border-[#2d3134] flex items-center justify-center shadow-md opacity-60"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon - BOLD */}
        <div className="animate-fade-in animation-delay-200">
          <div className="bg-white rounded-3xl p-10 border-4 border-[#2d3134] text-center shadow-brutal">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c8b8a8] to-[#8a9a8f] border-3 border-[#2d3134] mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-[#2d3134] mb-4">
              Coming in Phase 7
            </h3>
            <p className="text-[#6b6560] text-lg font-medium max-w-md mx-auto leading-relaxed">
              Your AI coach will provide personalized guidance, accountability, and motivation
              based on your habit patterns and journal entries.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['24/7 support', 'Personalized advice', 'Habit insights', 'Privacy-focused'].map((feature) => (
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
