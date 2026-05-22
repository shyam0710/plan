import { INSIGHTS } from '../../data/initial';

const BADGE = {
  positive:    { cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', label: 'Energy Peak Correlation' },
  warning:     { cls: 'bg-red-500/10 border-red-500/30 text-red-400',             label: 'Stress Risk Factor'      },
  correlation: { cls: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',    label: 'Pipeline Accelerator'    },
  burnout:     { cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400',       label: 'Context Shift Alert'     },
};

export default function Insights() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-xl space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Performance Matrix</span>
          </div>
          <h3 className="text-2xl font-black text-white">Co-Pilot Executive Correlations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By matching outbound deal velocity against sleep quality scores, daily habits, and deep focus timers,
            we isolate active momentum factors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSIGHTS.map((insight, i) => {
            const badge = BADGE[insight.type];
            return (
              <div key={i} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700/80 transition">
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${badge.cls}`}>
                  {badge.label}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">"{insight.text}"</p>
                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Confidence level: <strong>94% relational</strong></span>
                  <span className="text-indigo-400 cursor-pointer hover:underline">Apply Strategy Override →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
