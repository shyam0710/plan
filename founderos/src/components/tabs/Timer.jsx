import { useState, useEffect } from 'react';
import { playBeep } from '../../utils/audio';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function Timer({ tasks, onSessionComplete, showToast }) {
  const [timerMode,   setTimerMode]   = useState(25);
  const [seconds,     setSeconds]     = useState(25 * 60);
  const [running,     setRunning]     = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [activeTask,  setActiveTask]  = useState(tasks[0]?.id ?? 'none');

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          playBeep('complete');
          showToast('Deep focus interval complete! 10 points added to Founder Index.', 'success');
          onSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const handleToggle = () => {
    if (!running) {
      playBeep('start');
      showToast('Entering deep focus state. Outbound distractions frozen.', 'info');
    }
    setRunning((r) => !r);
  };

  const handleReset = (mins = timerMode) => {
    setRunning(false);
    setSeconds(mins * 60);
    setTimerMode(mins);
  };

  const todayTasks = tasks.filter((t) => t.status === 'today');

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500" />

        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Deep Focus Workspace</h3>
            <p className="text-xs text-slate-500">Isolate distractions and maximize outbound pipeline value</p>
          </div>

          {/* Mode selector */}
          <div className="flex justify-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
            {[25, 50, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleReset(mins)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  timerMode === mins ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {mins} Min Block
              </button>
            ))}
          </div>

          {/* Timer display */}
          <div className="relative py-8 flex justify-center">
            <div className="w-64 h-64 rounded-full border-4 border-slate-800/80 flex flex-col items-center justify-center bg-slate-900/40 shadow-inner">
              <span className="text-6xl font-mono font-black text-white tracking-widest leading-none">
                {fmt(seconds)}
              </span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-3">
                {running ? 'ACTIVE FLOW STATE' : 'PAUSED ENGINE'}
              </span>
            </div>
          </div>

          {/* Task selector */}
          <div className="text-left bg-slate-950 border border-slate-800/80 rounded-lg p-3">
            <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block mb-1">Affiliated Workspace Task</span>
            <select
              value={activeTask}
              onChange={(e) => setActiveTask(e.target.value)}
              className="bg-transparent text-indigo-300 text-xs font-medium w-full focus:outline-none border-none py-1"
            >
              {todayTasks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#090b11] text-slate-300">
                  {t.title}{t.is_revenue_generating ? ' ($ Rev)' : ''}
                </option>
              ))}
              <option value="none" className="bg-[#090b11] text-slate-300">No specific task</option>
            </select>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={handleToggle}
              className={`flex-1 py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                running
                  ? 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/35 border border-amber-700/50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {running ? 'Freeze Flow' : 'Enter Flow State'}
            </button>
            <button
              onClick={() => handleReset()}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold border border-slate-700/50"
            >
              Reset
            </button>
          </div>

          {/* Distraction log */}
          <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Log Distractions:</span>
              <span className="font-bold text-amber-500">x{distractions}</span>
            </div>
            <button
              onClick={() => { setDistractions((d) => d + 1); playBeep('click'); }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] rounded font-bold uppercase text-amber-400 tracking-wider transition"
            >
              + Log Distraction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
