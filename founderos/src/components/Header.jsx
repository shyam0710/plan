import { playBeep } from '../utils/audio';

const TAB_LABELS = {
  dashboard:  'Dashboard',
  'ai-chat':  'AI Co-Pilot Assistant',
  timer:      'Deep Work Timer',
  tasks:      'Task Board',
  habits:     'Habits & Routine',
  reflection: 'AI Reflection',
  kpis:       'Deal Analytics',
  insights:   'AI Insights',
};

export default function Header({
  activeTab,
  intention,
  tempIntention,
  isEditingIntention,
  onSetIntention,
  onSetTempIntention,
  onSetIsEditing,
}) {
  const commitIntention = () => {
    onSetIntention(tempIntention);
    onSetIsEditing(false);
    playBeep('click');
  };

  return (
    <header className="px-6 py-4 bg-[#0d0f17]/85 backdrop-blur-md border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-extrabold capitalize text-white tracking-tight">
          {TAB_LABELS[activeTab] ?? activeTab}
        </span>
        <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Workspace Sync
        </div>
      </div>

      {/* Focus intention */}
      <div className="flex-1 max-w-md bg-slate-900/60 border border-slate-800/80 rounded-lg px-4 py-2 flex items-center justify-between gap-4">
        <div className="truncate">
          <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest block">
            Primary Executive Focus
          </span>
          {isEditingIntention ? (
            <input
              type="text"
              value={tempIntention}
              onChange={(e) => onSetTempIntention(e.target.value)}
              onBlur={commitIntention}
              onKeyDown={(e) => e.key === 'Enter' && commitIntention()}
              autoFocus
              className="bg-transparent border-b border-indigo-500 focus:outline-none text-xs text-white w-full py-0.5 font-medium"
            />
          ) : (
            <p
              className="text-xs font-semibold text-slate-200 truncate cursor-pointer hover:underline"
              onClick={() => onSetIsEditing(true)}
            >
              {intention || 'Define what matters today…'}
            </p>
          )}
        </div>
        <button
          onClick={() => onSetIsEditing(!isEditingIntention)}
          className="p-1 hover:bg-slate-800 rounded transition"
          title="Edit focus intention"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
