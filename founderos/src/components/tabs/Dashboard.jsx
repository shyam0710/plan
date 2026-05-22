export default function Dashboard({
  tasks,
  habits,
  pipelineMetrics,
  reflection,
  currentFounderScore,
  onToggleTask,
  onToggleHabit,
  onSelectTask,
  onNavigate,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Row 1: Founder score / Pipeline / Outbound ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Founder Index */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent pointer-events-none rounded-bl-full" />
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Founder Index</h3>
            <p className="text-[11px] text-slate-500">Execution and routine health metric score</p>
          </div>
          <div className="my-6 flex items-center justify-around gap-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="#1e293b" fill="transparent" />
                <circle
                  cx="64" cy="64" r="54" strokeWidth="8" stroke="url(#indigoGrad)"
                  fill="transparent"
                  strokeDasharray={339.29}
                  strokeDashoffset={339.29 - (339.29 * currentFounderScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tighter">{currentFounderScore}</span>
                <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Index</span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              {[
                ['bg-indigo-500',  'Routines: +35pts'],
                ['bg-cyan-400',    'Execution: +30pts'],
                ['bg-violet-600',  'Deep Focus: +20pts'],
                ['bg-emerald-500', 'Reflection: +10pts'],
              ].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-sm ${bg} block`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs">
            <span className="text-slate-400">Weekly Performance Mean:</span>
            <span className="font-bold text-white px-2 py-0.5 bg-slate-900 rounded border border-slate-800">84 / 100</span>
          </div>
        </div>

        {/* Proposal Pipeline */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Proposal Pipeline</h3>
            <p className="text-[11px] text-slate-500">Pipeline generation vs target parameters</p>
          </div>
          <div className="my-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black text-slate-100">${pipelineMetrics.totalRevenue.toLocaleString()}</span>
              <span className="text-xs text-slate-400">Target: ${pipelineMetrics.revenueTarget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (pipelineMetrics.totalRevenue / pipelineMetrics.revenueTarget) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-emerald-400">
                {Math.round((pipelineMetrics.totalRevenue / pipelineMetrics.revenueTarget) * 100)}% Won
              </span>
              <span className="text-indigo-400">${pipelineMetrics.proposalValue.toLocaleString()} in pipeline</span>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 flex justify-between text-xs text-slate-400">
            <span>Outstanding Proposals:</span>
            <span className="font-bold text-indigo-300">{pipelineMetrics.proposalsSent} active</span>
          </div>
        </div>

        {/* Outbound Metrics */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Outbound Metrics</h3>
              <p className="text-[11px] text-slate-500">Core outreach triggers</p>
            </div>
            <button onClick={() => onNavigate('kpis')} className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold">
              Log metrics
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 my-2">
            {[
              ['Clients Spoken With', pipelineMetrics.clientsSpoken,      'text-slate-100'],
              ['1st Level Meetings',  pipelineMetrics.firstLevelMeetings,  'text-indigo-400'],
              ['Proposals Out',       pipelineMetrics.proposalsSent,        'text-cyan-400'],
              ['Proposal Value',      `$${(pipelineMetrics.proposalValue / 1000).toFixed(1)}k`, 'text-emerald-400'],
            ].map(([label, val, cls]) => (
              <div key={label} className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3">
                <span className="text-[10px] text-slate-500 block">{label}</span>
                <span className={`text-xl font-bold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800/80 pt-2 flex justify-between text-xs text-slate-400">
            <span>Conversion Rate:</span>
            <span className="font-bold text-emerald-400">
              {Math.round((pipelineMetrics.proposalsSent / (pipelineMetrics.clientsSpoken || 1)) * 100)}%
            </span>
          </div>
        </div>

      </div>

      {/* ── Row 2: Today tasks / Habits ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today tasks */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-white text-base">Primary Tasks Today</h4>
              <p className="text-xs text-slate-500">Scheduled execution priorities</p>
            </div>
            <button onClick={() => onNavigate('tasks')} className="text-xs text-indigo-400 hover:underline font-semibold">
              Open Task Board
            </button>
          </div>
          <div className="space-y-2.5">
            {tasks.filter((t) => t.status === 'today').length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No tasks scheduled for today.</p>
            ) : (
              tasks.filter((t) => t.status === 'today').map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition ${
                    task.completed
                      ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 max-w-xs sm:max-w-md">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleTask(task.id)}
                      className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950 cursor-pointer"
                    />
                    <div className="truncate cursor-pointer" onClick={() => onSelectTask(task)}>
                      <span className={`text-sm font-medium hover:text-indigo-400 transition ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        {task.scheduledTime && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-300 font-bold">
                            ⏰ {task.scheduledTime}
                          </span>
                        )}
                        {task.is_revenue_generating && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                            $$ Revenue
                          </span>
                        )}
                        {(task.tags ?? []).slice(0, 2).map((tg, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 text-[9px]">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Habits */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-white text-base">Routines & Habits</h4>
              <p className="text-xs text-slate-500">Build executive momentum through routine stability</p>
            </div>
            <button onClick={() => onNavigate('habits')} className="text-xs text-indigo-400 hover:underline font-semibold">
              Edit Habits
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition ${
                  habit.completed
                    ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${habit.completed ? 'bg-indigo-500 border-indigo-400 text-slate-950' : 'border-slate-700 bg-slate-950'}`}>
                  {habit.completed && (
                    <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold">{habit.name}</p>
                  <p className="text-[10px] text-slate-500">{habit.streak} day streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 3: AI Spotlight / Journal ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Spotlight */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#0d0f17] to-indigo-950/20 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">AI Spot Insight</span>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Deal Pipeline Optimization Recommendation</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
            "When Deep Work session volume is focused on Acme proposal drafts between 8:00 AM and 11:00 AM, your proposal
            conversion efficiency rises by 41%. Block secondary Slack channels during this early execution loop."
          </p>
          <div className="mt-4 flex gap-4">
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-400">
              Target Area: <strong className="text-indigo-300">Proposal Value Velocity</strong>
            </div>
            <button onClick={() => onNavigate('insights')} className="text-xs text-indigo-400 font-bold hover:underline self-center">
              View AI Predictions →
            </button>
          </div>
        </div>

        {/* Accountability log */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Evening Advisor</span>
            <h4 className="font-bold text-white text-base">Accountability Log</h4>
          </div>
          <p className="text-xs text-slate-400 italic my-3">
            {reflection.isSubmitted
              ? `"${reflection.aiSummary.substring(0, 85)}…"`
              : 'Document client deal progression, operational barriers, and focus levels to maintain executive index consistency.'}
          </p>
          <div>
            {reflection.isSubmitted ? (
              <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Logged with Core AI Brain</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('reflection')}
                className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold text-slate-200"
              >
                Start Daily Reflection
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
