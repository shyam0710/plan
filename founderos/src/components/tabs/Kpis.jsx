import { useState } from 'react';

const CHART_CONFIGS = [
  {
    key:      'meetings',
    title:    'First-Level Meetings Booked',
    sub:      'Manual logged daily outreach cycles',
    gradFrom: 'from-indigo-600',
    gradTo:   'to-indigo-400',
    labelFn:  (v) => `${v} meetings`,
    valColor: 'text-indigo-400',
  },
  {
    key:      'proposalVal',
    title:    'Identified Proposal Value ($)',
    sub:      'Pipeline volumes generated',
    gradFrom: 'from-emerald-600',
    gradTo:   'to-teal-400',
    labelFn:  (v) => `$${(v / 1000).toFixed(1)}k`,
    valColor: 'text-emerald-400',
  },
];

export default function Kpis({ kpiHistory, pipelineMetrics, onAddMetrics }) {
  const [form, setForm] = useState({ clients: '', meetings: '', proposals: '', value: '', revAdd: '' });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMetrics({
      clients:   parseInt(form.clients)    || 0,
      meetings:  parseInt(form.meetings)   || 0,
      proposals: parseInt(form.proposals)  || 0,
      value:     parseFloat(form.value)    || 0,
      revAdd:    parseFloat(form.revAdd)   || 0,
    });
    setForm({ clients: '', meetings: '', proposals: '', value: '', revAdd: '' });
  };

  const achieved = Math.round((pipelineMetrics.totalRevenue / pipelineMetrics.revenueTarget) * 100);
  const circleOffset = 238.76 - (238.76 * Math.min(100, achieved)) / 100;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Metric entry form */}
      <form onSubmit={handleSubmit} className="bg-[#0d0f17] border border-slate-800 rounded-xl p-5 flex flex-wrap gap-4 items-end">
        {[
          { label: 'Clients Spoken With', key: 'clients',   ph: '5'    },
          { label: '1st Level Meetings',  key: 'meetings',  ph: '2'    },
          { label: 'Proposals Sent',      key: 'proposals', ph: '1'    },
          { label: 'Proposal Value ($)',  key: 'value',     ph: '8500' },
          { label: 'Won Revenue ($)',     key: 'revAdd',    ph: '2500' },
        ].map(({ label, key, ph }) => (
          <div key={key} className="flex-1 min-w-[120px] space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">{label}</label>
            <input
              type="number"
              value={form[key]}
              onChange={set(key)}
              placeholder={ph}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow"
        >
          Log Pipeline Metrics
        </button>
      </form>

      {/* Goal tracker */}
      <div className="bg-[#0d0f17] border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-white text-base">Pipeline Goal Tracking</h4>
            <p className="text-xs text-slate-500">Live tracker mapping proposals completed vs quarterly targets</p>
          </div>
          <span className="text-xs text-slate-400">Target: ${pipelineMetrics.revenueTarget.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 block">Total Revenue Won</span>
            <span className="text-3xl font-black text-emerald-400">${pipelineMetrics.totalRevenue.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400">
              You need ${(pipelineMetrics.revenueTarget - pipelineMetrics.totalRevenue).toLocaleString()} more to cross this cycle's targets.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-500 block">Identified Proposal Value Pipeline</span>
            <span className="text-3xl font-black text-indigo-400">${pipelineMetrics.proposalValue.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400">Covering {pipelineMetrics.proposalsSent} active proposals.</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" strokeWidth="6" stroke="#1e293b" fill="transparent" />
                <circle
                  cx="48" cy="48" r="38" strokeWidth="6" stroke="#10b981" fill="transparent"
                  strokeDasharray={238.76}
                  strokeDashoffset={circleOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-white">{achieved}%</span>
                <span className="text-[8px] text-slate-400">Achieved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CHART_CONFIGS.map((chart) => {
          const maxVal = Math.max(...kpiHistory.map((k) => k[chart.key]));
          return (
            <div key={chart.key} className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6 space-y-4">
              <div>
                <h4 className="font-bold text-white text-base">{chart.title}</h4>
                <p className="text-xs text-slate-500">{chart.sub}</p>
              </div>
              <div className="h-64 flex items-end justify-between relative pt-8 px-2 border-b border-l border-slate-800">
                {kpiHistory.map((k, i) => {
                  const hp = maxVal > 0 ? (k[chart.key] / maxVal) * 80 : 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                      <span className={`text-[10px] ${chart.valColor} font-bold opacity-0 group-hover:opacity-100 absolute -top-5 transition duration-200`}>
                        {chart.labelFn(k[chart.key])}
                      </span>
                      <div
                        style={{ height: `${hp}%` }}
                        className={`w-4 sm:w-8 bg-gradient-to-t ${chart.gradFrom} ${chart.gradTo} rounded-t-sm transition-all duration-500`}
                      />
                      <span className="text-[9px] text-slate-500 mt-2 font-semibold">{k.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
