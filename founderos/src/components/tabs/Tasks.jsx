import { useState } from 'react';

const STAGES = [
  { id: 'backlog',   title: 'Task Backlog'      },
  { id: 'this_week', title: 'This Week'          },
  { id: 'today',     title: 'Scheduled (Today)'  },
  { id: 'done',      title: 'Fully Executed'     },
];

export default function Tasks({
  tasks,
  onCreateTask,
  onToggleTask,
  onMoveTask,
  onDeleteTask,
  onSelectTask,
  showToast,
}) {
  const [search,    setSearch]    = useState('');
  const [tagFilter, setTagFilter] = useState('');

  // Form state
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [priority,  setPriority]  = useState('medium');
  const [isRevenue, setIsRevenue] = useState(false);
  const [time,      setTime]      = useState('');
  const [tagsRaw,   setTagsRaw]   = useState('');

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags ?? []))).filter(Boolean);

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        (t.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchTag = !tagFilter || (t.tags ?? []).includes(tagFilter);
    return matchSearch && matchTag;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { showToast('Please enter a valid task title.', 'error'); return; }

    const tags = (tagsRaw || '').split(',').map((s) => s.trim()).filter(Boolean);
    onCreateTask({
      id:                    Date.now().toString(),
      title:                 title.trim(),
      description:           desc.trim(),
      priority,
      status:                'today',
      is_revenue_generating: isRevenue,
      completed:             false,
      scheduledTime:         time.trim() || null,
      tags,
    });

    setTitle(''); setDesc(''); setTime(''); setIsRevenue(false); setTagsRaw('');
    setSearch(''); setTagFilter('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Filter bar */}
      <div className="bg-[#0d0f17] border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Outbound Tasks Board</h3>
            <p className="text-xs text-slate-500">Log outreach progression, proposals, and pipeline meetings</p>
          </div>
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Filter Tags:</span>
          <button
            onClick={() => setTagFilter('')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition ${!tagFilter ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'}`}
          >
            All Tasks
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition ${tagFilter === tag ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {(search || tagFilter) && (
          <div className="p-2.5 bg-indigo-950/20 border border-indigo-500/20 rounded-lg flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              Showing {filtered.length} of {tasks.length} tasks.
            </span>
            <button
              onClick={() => { setSearch(''); setTagFilter(''); }}
              className="px-2 py-0.5 rounded bg-indigo-500 text-slate-950 font-bold hover:bg-indigo-400 transition text-[10px]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* New task form */}
      <form onSubmit={handleSubmit} className="bg-[#0d0f17] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Task Title</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule first level meeting…"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="space-y-1.5 shrink-0 w-full md:w-32">
          <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Time</label>
          <input
            type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="3:00 PM"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="space-y-1.5 shrink-0 w-full md:w-44">
          <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Tags (comma-sep.)</label>
          <input
            type="text" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="proposals, launch"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div className="space-y-1.5 shrink-0 w-full md:w-36">
          <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Priority</label>
          <select
            value={priority} onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2 h-10 shrink-0 bg-slate-950 border border-slate-800 rounded-lg px-4 w-full md:w-auto">
          <input
            type="checkbox" id="rev-gen" checked={isRevenue} onChange={(e) => setIsRevenue(e.target.checked)}
            className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 bg-slate-900 rounded cursor-pointer"
          />
          <label htmlFor="rev-gen" className="text-xs font-semibold text-slate-300 cursor-pointer whitespace-nowrap">
            Revenue Generating
          </label>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shrink-0 shadow-md"
        >
          Add Task
        </button>
      </form>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STAGES.map((stage) => {
          const stageTasks = filtered.filter((t) => t.status === stage.id);
          return (
            <div key={stage.id} className="bg-[#0d0f17] border border-slate-800/80 rounded-xl p-4 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
                <h4 className="font-bold text-slate-200 text-xs tracking-wide uppercase flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${stage.id === 'done' ? 'bg-emerald-400' : stage.id === 'today' ? 'bg-indigo-500' : 'bg-slate-500'}`} />
                  {stage.title}
                </h4>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {stageTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {stageTasks.length === 0 ? (
                  <p className="text-[11px] text-slate-600 italic py-6 text-center">Empty Stage</p>
                ) : (
                  stageTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg hover:border-slate-700/80 transition flex flex-col gap-3 group animate-fadeIn">
                      <div className="cursor-pointer" onClick={() => onSelectTask(task)}>
                        <span className={`text-xs font-semibold leading-relaxed group-hover:text-indigo-400 transition ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-[10px] text-slate-500 truncate mt-1">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {task.scheduledTime && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-300 font-extrabold">
                              ⏰ {task.scheduledTime}
                            </span>
                          )}
                          {task.is_revenue_generating && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                              $$ Rev
                            </span>
                          )}
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-slate-900 text-slate-400'}`}>
                            {task.priority}
                          </span>
                        </div>
                        {(task.tags ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(task.tags ?? []).map((tg, i) => (
                              <span key={i} className="text-[9px] text-indigo-400 bg-slate-900 border border-slate-800/60 px-1.5 py-0.5 rounded">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-900/80 pt-2.5 flex items-center justify-between gap-1">
                        {stage.id !== 'done' ? (
                          <button onClick={() => onToggleTask(task.id)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                            {task.completed ? 'Mark Open' : 'Done'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-500 font-bold">Cleared</span>
                        )}
                        <div className="flex items-center gap-1">
                          <button onClick={() => onDeleteTask(task.id)} className="p-1 hover:text-red-400 text-slate-600 transition" title="Delete">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <select
                            value={task.status}
                            onChange={(e) => onMoveTask(task.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded p-1 cursor-pointer focus:outline-none"
                          >
                            <option value="backlog">Backlog</option>
                            <option value="this_week">This Wk</option>
                            <option value="today">Today</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
