import { useState } from 'react';

export default function TaskModal({ task, onClose, onDelete, onUpdateField, showToast }) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    const clean = newTag.trim();
    if (!clean) return;
    const current = task.tags ?? [];
    if (!current.includes(clean)) {
      onUpdateField(task.id, 'tags', [...current, clean]);
      showToast(`Added tag #${clean}`, 'success');
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag) => {
    onUpdateField(task.id, 'tags', (task.tags ?? []).filter((t) => t !== tag));
    showToast(`Removed tag #${tag}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0d0f17] border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
              Edit Task Details
            </span>
            {task.is_revenue_generating && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                $$ Rev Gen
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition text-lg font-bold">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[450px] overflow-y-auto">

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Task Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => onUpdateField(task.id, 'title', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">
              Additional Description
            </label>
            <textarea
              rows="3"
              value={task.description ?? ''}
              onChange={(e) => onUpdateField(task.id, 'description', e.target.value)}
              placeholder="Additional notes, custom outlines, or deal metrics…"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 tracking-widest font-black uppercase block">Status</label>
              <select
                value={task.status}
                onChange={(e) => onUpdateField(task.id, 'status', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="backlog">Task Backlog</option>
                <option value="this_week">This Week</option>
                <option value="today">Today (Focus)</option>
                <option value="done">Fully Executed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 tracking-widest font-black uppercase block">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => onUpdateField(task.id, 'priority', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Time + Revenue toggle */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 tracking-widest font-black uppercase block">
                Execution Hour
              </label>
              <input
                type="text"
                value={task.scheduledTime ?? ''}
                placeholder="e.g. 11:30 AM"
                onChange={(e) => onUpdateField(task.id, 'scheduledTime', e.target.value || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => onUpdateField(task.id, 'is_revenue_generating', !task.is_revenue_generating)}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  task.is_revenue_generating
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Revenue Generating
              </button>
            </div>
          </div>

          {/* Tag manager */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Tag Manager</label>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                placeholder="New tag…"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition"
              >
                Add Tag
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(task.tags ?? []).length === 0 ? (
                <span className="text-xs text-slate-600 italic">No tags assigned.</span>
              ) : (
                (task.tags ?? []).map((tg, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-indigo-400 font-semibold flex items-center gap-1.5 animate-fadeIn"
                  >
                    #{tg}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tg)}
                      className="hover:text-red-400 text-slate-500 font-bold transition text-[10px]"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Task
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-lg transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
