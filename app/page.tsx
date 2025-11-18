import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafaf8]">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large organic blob - clay/terracotta - Enhanced visibility */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 animate-blob-slow"
          style={{
            background: 'radial-gradient(circle at 30% 40%, #d4847c 0%, #c17161 50%, transparent 100%)',
          }}
        />

        {/* Medium blob - sage - Enhanced visibility */}
        <div
          className="absolute bottom-20 -left-32 w-[500px] h-[500px] rounded-full opacity-25 animate-blob animation-delay-4000"
          style={{
            background: 'radial-gradient(circle at 60% 50%, #8a9a8f 0%, #5f7367 50%, transparent 100%)',
          }}
        />

        {/* Small accent blob - warm neutral - Enhanced visibility */}
        <div
          className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-18 animate-blob animation-delay-2000"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #c8b8a8 0%, transparent 70%)',
          }}
        />

        {/* Grain texture overlay - Enhanced for organic feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-slide-in-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#d4847c]/20">
              <div className="w-2 h-2 rounded-full bg-[#d4847c] animate-pulse" />
              <span className="text-sm font-medium text-[#6b6560] tracking-wide">
                Privacy-first habit tracking
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] text-[#2d3134] tracking-tight">
                Build habits
                <br />
                that
                <span className="relative inline-block ml-4">
                  <span className="relative z-10 italic" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
                    flow
                  </span>
                  {/* Underline decoration - Enhanced visibility */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#d4847c] opacity-60"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 6C50 2 150 10 198 6"
                      stroke="currentColor"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-[#6b6560] leading-relaxed max-w-xl font-light">
                A minimalist space for tracking daily habits, powered by AI insights
                that respect your privacy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/habits">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-[#d4847c] hover:bg-[#c17161] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start tracking
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#8a9a8f] text-[#5f7367] hover:bg-[#8a9a8f]/10 px-8 py-6 text-lg rounded-2xl"
              >
                Learn more
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['AI-powered insights', 'Privacy-first', 'Offline-ready'].map((feature, idx) => (
                <div
                  key={feature}
                  className="px-4 py-2 rounded-full bg-[#f5efe6] text-[#6b6560] text-sm font-medium animate-scale-in"
                  style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative lg:h-[600px] animate-slide-in-right animation-delay-200">
            {/* Decorative card stack */}
            <div className="relative h-full flex items-center justify-center">
              {/* Background cards */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute w-[320px] h-[200px] rounded-3xl shadow-xl rotate-6 opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #8a9a8f 0%, #5f7367 100%)',
                  }}
                />
                <div
                  className="absolute w-[320px] h-[200px] rounded-3xl shadow-xl -rotate-3 opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #c8b8a8 0%, #8a9a8f 100%)',
                  }}
                />
              </div>

              {/* Main card */}
              <div className="relative glass rounded-3xl p-8 w-[340px] shadow-2xl border border-white/40 animate-float">
                <div className="space-y-6">
                  {/* Mock habit item */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4847c] to-[#c17161] flex items-center justify-center text-2xl shadow-lg">
                      💪
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-[#2d3134] rounded-full w-32 mb-2" />
                      <div className="h-2 bg-[#6b6560]/30 rounded-full w-24" />
                    </div>
                  </div>

                  {/* Mock progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#6b6560]">
                      <span className="h-2 bg-[#6b6560]/50 rounded w-16" />
                      <span className="h-2 bg-[#6b6560]/50 rounded w-12" />
                    </div>
                    <div className="h-3 bg-[#e8dfd5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d4847c] to-[#c17161] rounded-full"
                        style={{ width: '68%' }}
                      />
                    </div>
                  </div>

                  {/* Mock week grid */}
                  <div className="flex gap-2">
                    {[1, 1, 0, 1, 1, 1, 0].map((filled, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-lg ${
                          filled
                            ? 'bg-gradient-to-br from-[#8a9a8f] to-[#5f7367]'
                            : 'bg-[#e8dfd5]'
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

      {/* Bottom Tech Stack Badge */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500">
        <div className="glass rounded-full px-6 py-3 border border-white/30">
          <p className="text-xs text-[#6b6560] font-medium">
            Built with Next.js 15 • TypeScript • Tailwind CSS • Drizzle ORM
          </p>
        </div>
      </div>
    </div>
  );
}
