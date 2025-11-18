import { Card } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5efe6 0%, #fafaf8 50%, #e8dfd5 100%)'
      }}
    >
      {/* BOLD Geometric Accents - SOLID COLORS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left terracotta circle - SOLID */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4847c] rounded-full" />

        {/* Bottom right sage square - SOLID */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#8a9a8f] rounded-3xl -rotate-12" />

        {/* Diagonal accent stripe */}
        <div className="absolute top-1/3 -left-20 w-1/3 h-1 bg-gradient-to-r from-transparent via-[#c8b8a8] to-transparent rotate-45" />
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

        {/* Stats Grid - BOLD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up animation-delay-100">
          {[
            { label: 'Total Habits', value: '12', change: '+2 this week', color: 'from-[#d4847c] to-[#c17161]' },
            { label: 'Completion Rate', value: '68%', change: '+5% vs last week', color: 'from-[#8a9a8f] to-[#5f7367]' },
            { label: 'Current Streak', value: '14 days', change: 'Personal best!', color: 'from-[#c8b8a8] to-[#8a9a8f]' },
            { label: 'Weekly Score', value: '92', change: '+8 points', color: 'from-[#d4847c] to-[#8a9a8f]' },
          ].map((stat, idx) => (
            <Card
              key={stat.label}
              className={`border-4 border-[#2d3134] bg-white shadow-brutal hover:shadow-xl transition-all duration-300 animate-scale-in`}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className={`h-3 bg-gradient-to-r ${stat.color}`} />
              <div className="p-6 space-y-3">
                <p className="text-sm text-[#6b6560] font-bold uppercase tracking-wide">{stat.label}</p>
                <p className="text-4xl font-black text-[#2d3134]">{stat.value}</p>
                <p className="text-sm text-[#8a9a8f] font-bold">{stat.change}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Preview - BOLD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up animation-delay-200">
          {/* Weekly Completion Chart - BOLD */}
          <Card className="border-4 border-[#2d3134] bg-white shadow-brutal">
            <div className="h-3 bg-gradient-to-r from-[#d4847c] to-[#8a9a8f]" />
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-[#2d3134]">Weekly Completion</h3>
                <p className="text-sm text-[#6b6560] mt-2 font-medium">Your habit performance over the week</p>
              </div>

              {/* Mock bar chart - CHUNKY BARS */}
              <div className="space-y-4">
                {[
                  { day: 'Mon', value: 85, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Tue', value: 92, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Wed', value: 78, color: 'bg-gradient-to-r from-[#8a9a8f] to-[#5f7367]' },
                  { day: 'Thu', value: 88, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Fri', value: 95, color: 'bg-gradient-to-r from-[#d4847c] to-[#c17161]' },
                  { day: 'Sat', value: 70, color: 'bg-gradient-to-r from-[#c8b8a8] to-[#8a9a8f]' },
                  { day: 'Sun', value: 65, color: 'bg-gradient-to-r from-[#c8b8a8] to-[#8a9a8f]' },
                ].map((bar) => (
                  <div key={bar.day} className="flex items-center gap-4">
                    <span className="text-base font-black text-[#2d3134] w-12">{bar.day}</span>
                    <div className="flex-1 h-10 bg-[#f5efe6] rounded-xl overflow-hidden border-2 border-[#e8dfd5]">
                      <div
                        className={`h-full ${bar.color} rounded-xl transition-all duration-500 flex items-center justify-end pr-4 border-r-2 border-[#2d3134]`}
                        style={{ width: `${bar.value}%` }}
                      >
                        <span className="text-sm font-black text-white">{bar.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Category Breakdown - BOLD */}
          <Card className="border-4 border-[#2d3134] bg-white shadow-brutal">
            <div className="h-3 bg-gradient-to-r from-[#8a9a8f] to-[#c8b8a8]" />
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-[#2d3134]">Category Breakdown</h3>
                <p className="text-sm text-[#6b6560] mt-2 font-medium">Habits by category</p>
              </div>

              {/* Mock donut chart with list - THICKER STROKE */}
              <div className="flex items-center justify-center">
                <div className="relative w-56 h-56">
                  {/* Outer ring - BOLD STROKE */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Health - 35% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="18"
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
                      strokeWidth="18"
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
                      strokeWidth="18"
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
                      strokeWidth="18"
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

                  {/* Center label - BOLDER */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-black text-[#2d3134]">12</p>
                      <p className="text-sm text-[#6b6560] font-bold">Habits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend - BOLDER */}
              <div className="space-y-3">
                {[
                  { label: 'Health', value: '35%', color: 'from-[#d4847c] to-[#c17161]' },
                  { label: 'Work', value: '25%', color: 'from-[#8a9a8f] to-[#5f7367]' },
                  { label: 'Learning', value: '25%', color: 'from-[#c8b8a8] to-[#8a9a8f]' },
                  { label: 'Other', value: '15%', color: 'from-[#e8dfd5] to-[#c8b8a8]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color} border-2 border-[#2d3134]`} />
                      <span className="text-base text-[#6b6560] font-bold">{item.label}</span>
                    </div>
                    <span className="text-base font-black text-[#2d3134]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon - BOLD */}
        <div className="animate-fade-in animation-delay-300">
          <div className="bg-white rounded-3xl p-10 border-4 border-[#2d3134] text-center shadow-brutal">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#8a9a8f] to-[#5f7367] border-3 border-[#2d3134] mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-[#2d3134] mb-4">
              Coming in Phase 6
            </h3>
            <p className="text-[#6b6560] text-lg font-medium max-w-md mx-auto leading-relaxed">
              AI-powered insights will analyze your habits, identify patterns, and provide
              personalized recommendations for improvement.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Weekly reports', 'Trend analysis', 'Smart predictions', 'Personalized tips'].map((feature) => (
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
