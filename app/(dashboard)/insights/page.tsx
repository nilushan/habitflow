import { Card } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] relative overflow-hidden">
      {/* Organic background - Enhanced visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 right-1/4 w-80 h-80 rounded-full opacity-22 animate-blob-slow"
          style={{
            background: 'radial-gradient(circle at 40% 40%, #8a9a8f 0%, transparent 70%)',
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

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-16 bg-gradient-to-b from-[#8a9a8f] to-[#d4847c] rounded-full" />
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-[#2d3134] tracking-tight">
                Insights
              </h1>
              <p className="text-lg text-[#6b6560] mt-2 font-light">
                AI-powered analysis of your habits
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animation-delay-100">
          {[
            { label: 'Total Habits', value: '12', change: '+2 this week', color: 'from-[#d4847c] to-[#c17161]' },
            { label: 'Completion Rate', value: '68%', change: '+5% vs last week', color: 'from-[#8a9a8f] to-[#5f7367]' },
            { label: 'Current Streak', value: '14 days', change: 'Personal best!', color: 'from-[#c8b8a8] to-[#8a9a8f]' },
            { label: 'Weekly Score', value: '92', change: '+8 points', color: 'from-[#d4847c] to-[#8a9a8f]' },
          ].map((stat, idx) => (
            <Card
              key={stat.label}
              className={`border border-[#e8dfd5]/50 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in`}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
              <div className="p-6 space-y-2">
                <p className="text-sm text-[#6b6560] font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-[#2d3134]">{stat.value}</p>
                <p className="text-xs text-[#8a9a8f] font-medium">{stat.change}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animation-delay-200">
          {/* Weekly Completion Chart */}
          <Card className="border border-[#e8dfd5]/50 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="h-1 bg-gradient-to-r from-[#d4847c] to-[#8a9a8f]" />
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#2d3134]">Weekly Completion</h3>
                <p className="text-sm text-[#6b6560] mt-1">Your habit performance over the week</p>
              </div>

              {/* Mock bar chart */}
              <div className="space-y-3">
                {[
                  { day: 'Mon', value: 85, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Tue', value: 92, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Wed', value: 78, color: 'bg-gradient-to-r from-[#8a9a8f] to-[#5f7367]' },
                  { day: 'Thu', value: 88, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Fri', value: 95, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Sat', value: 70, color: 'bg-gradient-to-r from-[#c8b8a8] to-[#8a9a8f]' },
                  { day: 'Sun', value: 65, color: 'bg-gradient-to-r from-[#c8b8a8] to-[#8a9a8f]' },
                ].map((bar) => (
                  <div key={bar.day} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#6b6560] w-10">{bar.day}</span>
                    <div className="flex-1 h-8 bg-[#f5efe6] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${bar.value}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{bar.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="border border-[#e8dfd5]/50 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="h-1 bg-gradient-to-r from-[#8a9a8f] to-[#c8b8a8]" />
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#2d3134]">Category Breakdown</h3>
                <p className="text-sm text-[#6b6560] mt-1">Habits by category</p>
              </div>

              {/* Mock donut chart with list */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Outer ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Health - 35% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="12"
                      strokeDasharray="88 176"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Work - 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="12"
                      strokeDasharray="63 201"
                      strokeDashoffset="-88"
                      strokeLinecap="round"
                    />
                    {/* Learning - 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient3)"
                      strokeWidth="12"
                      strokeDasharray="63 201"
                      strokeDashoffset="-151"
                      strokeLinecap="round"
                    />
                    {/* Other - 15% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient4)"
                      strokeWidth="12"
                      strokeDasharray="38 226"
                      strokeDashoffset="-214"
                      strokeLinecap="round"
                    />

                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4847c" />
                        <stop offset="100%" stopColor="#c17161" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8a9a8f" />
                        <stop offset="100%" stopColor="#5f7367" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c8b8a8" />
                        <stop offset="100%" stopColor="#8a9a8f" />
                      </linearGradient>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e8dfd5" />
                        <stop offset="100%" stopColor="#c8b8a8" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#2d3134]">12</p>
                      <p className="text-xs text-[#6b6560]">Habits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {[
                  { label: 'Health', value: '35%', color: 'from-[#d4847c] to-[#c17161]' },
                  { label: 'Work', value: '25%', color: 'from-[#8a9a8f] to-[#5f7367]' },
                  { label: 'Learning', value: '25%', color: 'from-[#c8b8a8] to-[#8a9a8f]' },
                  { label: 'Other', value: '15%', color: 'from-[#e8dfd5] to-[#c8b8a8]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color}`} />
                      <span className="text-sm text-[#6b6560]">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#2d3134]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="animate-fade-in animation-delay-300">
          <div className="glass rounded-2xl p-6 border border-[#8a9a8f]/20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#8a9a8f] to-[#5f7367] mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#2d3134] mb-2">
              Coming in Phase 6
            </h3>
            <p className="text-[#6b6560] max-w-md mx-auto">
              AI-powered insights will analyze your habits, identify patterns, and provide
              personalized recommendations for improvement.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Weekly reports', 'Trend analysis', 'Smart predictions', 'Personalized tips'].map((feature) => (
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
