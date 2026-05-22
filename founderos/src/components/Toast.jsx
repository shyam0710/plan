export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const dot = {
    success: 'bg-emerald-400',
    warning: 'bg-red-400',
    info:    'bg-cyan-400',
    error:   'bg-red-400',
  }[toast.type] ?? 'bg-cyan-400';

  return (
    <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-3 animate-slideUp max-w-sm">
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
      <span>{toast.message}</span>
      <button
        onClick={onDismiss}
        className="ml-auto font-bold text-slate-500 hover:text-white transition"
      >
        &times;
      </button>
    </div>
  );
}
