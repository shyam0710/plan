import { useState } from 'react';

export default function Reflection({ reflection, reflectionsHistory, onSubmit, onReset }) {
  const [wins,   setWins]   = useState('');
  const [losses, setLosses] = useState('');
  const [energy, setEnergy] = useState(8);
  const [mood,   setMood]   = useState(8);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wins.trim() && !losses.trim()) return;
    onSubmit({ wins, losses, energy, mood });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">

      <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-white">Daily Cognitive Integration</h3>
          <p className="text-xs text-slate-500">Log bottlenecks, client reactions, and physical states</p>
        </div>

        {reflection.isSubmitted ? (
          <div className="space-y-6 animate-slideUp">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  AI Executive Synthesis Completed
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200">"{reflection.aiSummary}"</p>
            </div>

            <div className="bg-indigo-950/10 border border-slate-800 p-6 rounded-xl space-y-3">
              <h4 className="font-extrabold text-xs text-indigo-400 uppercase tracking-widest">
                Co-Pilot Reflection Matrix Output
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{reflection.aiAnalysis}</p>
            </div>

            <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-900">
              <div className="flex gap-4">
                <span>Energy: <strong className="text-indigo-400">{reflection.energy}/10</strong></span>
                <span>Mood: <strong className="text-cyan-400">{reflection.mood}/10</strong></span>
              </div>
              <button onClick={onReset} className="text-xs text-indigo-400 hover:underline">
                Reset / Enter New Session
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                1. What were today's core strategic pipeline wins?
              </label>
              <textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                rows="3"
                placeholder="e.g. Sent out Acme proposals with a value index of 15k…"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                2. Where did outreach or execution stagger?
              </label>
              <textarea
                value={losses}
                onChange={(e) => setLosses(e.target.value)}
                rows="3"
                placeholder="e.g. Long focus gaps preparing structural proposals…"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              {[
                { label: 'Physical Energy Score', val: energy, setter: setEnergy, color: 'text-indigo-400', accent: 'accent-indigo-500' },
                { label: 'Mood / Stress Level',   val: mood,   setter: setMood,   color: 'text-cyan-400',   accent: 'accent-cyan-400'   },
              ].map(({ label, val, setter, color, accent }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>{label}</span>
                    <span className={color}>{val} / 10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={val}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${accent}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-900">
              <span className="text-[10px] text-slate-500 max-w-sm">
                Insights run on custom algorithms matching stress to output proposals.
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow shadow-indigo-600/10"
              >
                Generate Core Feedback →
              </button>
            </div>
          </form>
        )}
      </div>

      {/* History */}
      <div className="space-y-4">
        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Archives</span>
        {reflectionsHistory.map((h, i) => (
          <div key={i} className="bg-[#0d0f17] border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-xs font-extrabold text-slate-300">{h.date}</span>
              <div className="flex gap-3 text-[10px]">
                <span>Energy: <strong className="text-indigo-400">{h.energy}</strong></span>
                <span>Mood: <strong className="text-cyan-400">{h.mood}</strong></span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <div><strong className="text-slate-300 block mb-0.5">Wins:</strong><p>{h.wins}</p></div>
              <div><strong className="text-slate-300 block mb-0.5">Losses:</strong><p>{h.losses}</p></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
