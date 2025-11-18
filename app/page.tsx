import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to right, #d4847c 0%, #d4847c 50%, #f5efe6 50%, #f5efe6 100%)'
      }}
    >
      {/* BOLD SPLIT-SCREEN HERO - Editorial Magazine Style */}
      <div className="relative min-h-screen flex items-center">
        {/* Vertical divider accent */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#2d3134] opacity-20 z-10" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
          {/* Left Column - BOLD WHITE TEXT ON TERRACOTTA */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Eyebrow - Inverted */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#ffffff' }}>
                PRIVACY-FIRST HABIT TRACKING
              </span>
            </div>

            {/* MASSIVE BOLD Headline - WHITE */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight" style={{ color: '#ffffff' }}>
                <span className="block">Build</span>
                <span className="block">habits</span>
                <span className="block">that</span>
                <span className="relative inline-block mt-2">
                  <span
                    className="relative z-10 italic"
                    style={{
                      fontVariationSettings: "'SOFT' 100, 'WONK' 1",
                      color: '#ffffff'
                    }}
                  >
                    flow
                  </span>
                  {/* Bold underline - WHITE */}
                  <svg
                    className="absolute -bottom-4 left-0 w-full h-8 text-white"
                    viewBox="0 0 200 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path d="M3 10C40 6 80 14 120 9C160 13 180 7 197 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <path d="M2 14C45 10 85 17 125 13C165 16 185 11 198 14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl sm:text-2xl leading-relaxed max-w-xl font-light" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                A minimalist space for tracking daily habits, powered by AI insights
                that respect your privacy.
              </p>
            </div>

            {/* CTA Buttons - INVERTED FOR TERRACOTTA BG */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/habits">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-white hover:bg-[#f5efe6] text-[#d4847c] px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start tracking
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 hover:bg-white/10 px-8 py-6 text-lg rounded-2xl"
                style={{ color: '#ffffff' }}
              >
                Learn more
              </Button>
            </div>

            {/* Feature Pills - INVERTED */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['AI-powered insights', 'Privacy-first', 'Offline-ready'].map((feature, idx) => (
                <div
                  key={feature}
                  className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium animate-scale-in border border-white/30"
                  style={{ animationDelay: `${(idx + 1) * 100}ms`, color: '#ffffff' }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - DRAMATIC CARD ON CREAM BG */}
          <div className="relative lg:h-[600px] animate-slide-in-right animation-delay-200">
            {/* Decorative background shapes - SOLID COLORS */}
            <div className="relative h-full flex items-center justify-center">
              {/* Bold geometric accent shapes */}
              <div className="absolute top-10 right-10 w-32 h-32 rounded-3xl bg-[#8a9a8f] rotate-12" />
              <div className="absolute bottom-20 left-10 w-24 h-24 rounded-2xl bg-[#c8b8a8] -rotate-6" />

              {/* Main card - BOLD SHADOWS */}
              <div className="relative bg-white rounded-3xl p-8 w-[340px] shadow-brutal border-4 border-[#2d3134]">
                <div className="space-y-6">
                  {/* Mock habit item - ULTRA BOLD */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center text-4xl border-3 border-[#2d3134] transform hover:scale-110 transition-transform">
                      💪
                    </div>
                    <div className="flex-1">
                      <div className="h-5 bg-[#2d3134] rounded-lg w-40 mb-2" />
                      <div className="h-3 bg-[#6b6560] rounded-lg w-32" />
                    </div>
                  </div>

                  {/* Mock progress bar - MAXIMUM BOLD */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="h-3 bg-[#2d3134] rounded w-24" />
                      <span className="h-3 bg-[#2d3134] rounded w-20" />
                    </div>
                    <div className="h-5 bg-[#e8dfd5] rounded-lg overflow-hidden border-2 border-[#2d3134]">
                      <div
                        className="h-full bg-gradient-to-r from-[#d4847c] to-[#8a9a8f]"
                        style={{ width: '68%' }}
                      />
                    </div>
                  </div>

                  {/* Mock week grid - CHUNKY */}
                  <div className="flex gap-2">
                    {[1, 1, 0, 1, 1, 1, 0].map((filled, idx) => (
                      <div
                        key={idx}
                        className={`w-10 h-10 rounded-lg transform hover:scale-110 transition-transform border-2 ${
                          filled
                            ? 'bg-gradient-to-br from-[#8a9a8f] to-[#5f7367] border-[#2d3134]'
                            : 'bg-white border-[#e8dfd5]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom Tech Stack Badge - BOLD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500 z-10">
        <div className="bg-[#2d3134] rounded-full px-6 py-3 border-2 border-white shadow-xl">
          <p className="text-xs text-white font-bold tracking-wide">
            Built with Next.js 15 • TypeScript • Tailwind CSS • Drizzle ORM
          </p>
        </div>
      </div>
    </div>
  );
}
