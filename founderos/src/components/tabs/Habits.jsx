import { useState } from 'react';

export default function Habits({ habits, onToggleHabit, onAddHabit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddHabit(name.trim());
    setName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Add habit form */}
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Add Habit</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Habit Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Publish proposal breakdowns…"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shadow"
            >
              Establish Routine Habit
            </button>
          </form>
        </div>

        {/* Streak engine */}
        <div className="lg:col-span-2 bg-[#0d0f17] border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-base">Continuous Streak Engine</h3>
            <p className="text-xs text-slate-500">Log consistency over execution periods</p>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ${
                      habit.completed
                        ? 'bg-indigo-500 border-indigo-400 text-slate-950 shadow-md shadow-indigo-500/20'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <svg
                      className="w-4 h-4 stroke-[3.5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={habit.completed ? 'currentColor' : 'transparent'}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${habit.completed ? 'text-indigo-200' : 'text-slate-200'}`}>
                      {habit.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Streak: <strong className="text-indigo-400">{habit.streak} days</strong>
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        i === 4 && habit.completed
                          ? 'bg-indigo-500'
                          : i < 4
                            ? 'bg-indigo-500/40'
                            : 'bg-slate-900 border border-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
