import { useState, useEffect, useRef } from 'react';
import { fetchWithBackoff, GEMINI_SYSTEM_PROMPT, GEMINI_RESPONSE_SCHEMA } from '../../utils/api';
import { playBeep } from '../../utils/audio';

const WELCOME_MSG = {
  id: 'welcome-1',
  sender: 'ai',
  text: 'Welcome Shyam. I am your FounderOS Co-Pilot. Tell me about client meetings, custom proposals sent, or execution plans. I will dynamically guide you, map deal statistics, and automatically structure and inject tagged tasks directly into your execution board.',
  timestamp: 'Just now',
  tasksInjected: [],
};

const PROMPT_IDEAS = [
  'Schedule a first level meeting with Beta Brand tomorrow at 1:00 PM with tags meetings, launch',
  'I spoke with two clients and need to write proposal value breakdowns in backlog with tags proposals',
  'Need to review proposals sent list today at 3:00 PM, high priority and revenue generating',
  'Prepare proposals for dynamic partner sync tomorrow morning',
];

export default function AiChat({ onInjectTasks, showToast, onSelectTask }) {
  const [messages,       setMessages]       = useState([WELCOME_MSG]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading,      setIsLoading]      = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userText = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    playBeep('click');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
      if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not set');

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: GEMINI_RESPONSE_SCHEMA,
        },
        systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
      };

      const res    = await fetchWithBackoff(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      const raw    = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(raw);
      const injected = (parsed.extractedTasks ?? []).map((item) => ({
        id:                    `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title:                 item.title,
        description:           item.description ?? '',
        priority:              item.priority    ?? 'medium',
        status:                item.status      ?? 'today',
        is_revenue_generating: !!item.is_revenue_generating,
        completed:             false,
        scheduledTime:         item.scheduledTime ?? null,
        tags:                  item.tags ?? [],
      }));

      if (injected.length > 0) onInjectTasks(injected);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: parsed.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tasksInjected: injected,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: err.message === 'VITE_GEMINI_API_KEY is not set'
            ? 'AI Co-Pilot is offline. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.'
            : 'Apologies, Shyam. My core context limits were interrupted. Tell me again what tasks I should inject into your Pipeline Board.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tasksInjected: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">

      {/* Chat panel */}
      <div className="lg:col-span-2 bg-[#0d0f17] border border-slate-800 rounded-xl flex flex-col h-[600px] overflow-hidden">

        {/* Chat header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">FounderOS Cognitive Assistant</h3>
              <p className="text-[10px] text-slate-400">Gemini 2.0 Flash · Auto-Scheduling</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20 uppercase tracking-widest font-bold">
            Inject Enabled
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-xl p-3.5 text-xs ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.tasksInjected?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-wider block">
                      🤖 Auto-Scheduled Pipeline Injections:
                    </span>
                    {msg.tasksInjected.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-[11px] hover:border-indigo-500/40 cursor-pointer transition"
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-300 block truncate">{task.title}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className={`px-1 rounded text-[8px] font-bold uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-900 text-slate-400'}`}>
                              {task.priority}
                            </span>
                            {task.scheduledTime && (
                              <span className="px-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[8px] font-bold">
                                ⏰ {task.scheduledTime}
                              </span>
                            )}
                            {task.is_revenue_generating && (
                              <span className="px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-extrabold uppercase">
                                $$ Rev
                              </span>
                            )}
                            {(task.tags ?? []).map((t, i) => (
                              <span key={i} className="px-1 rounded bg-slate-900 text-slate-400 text-[8px]">#{t}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-[9px] text-indigo-400 font-semibold italic bg-slate-900 px-1.5 py-0.5 rounded capitalize shrink-0">
                          View Details
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-600 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-slate-900 border border-slate-800 rounded-xl rounded-bl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                {[0, 100, 200].map((d) => (
                  <span key={d} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
                <span className="italic">Parsing pipeline actions…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800/80 bg-slate-900/20 flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="E.g. I spoke with Acme Corp, send proposal at 4:30 PM, tags: proposals, outreach…"
            className="flex-1 bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !currentMessage.trim()}
            className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest block">Smart Extraction Engine</span>
            <h4 className="font-bold text-white text-sm">Automated Scheduling</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Talk naturally about your day's work. The model identifies tasks, extracts execution hours, tags them, and updates your Pipeline Board in real-time.
          </p>
          <div className="space-y-2 border-t border-slate-900 pt-3">
            {[
              ['"Schedule a client chat…"',    'Places into Today, This Week, or Backlog'],
              ['"Set time to 3:00 PM…"',       'Extracts scheduling metadata automatically'],
              ['"Add tags SaaS, outbound…"',   'Applies custom tag arrays for filtering'],
            ].map(([title, desc]) => (
              <div key={title} className="p-2 bg-slate-950 border border-slate-800 rounded">
                <p className="text-[11px] font-bold text-slate-300">{title}</p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d0f17] border border-slate-800 rounded-xl p-5 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">One-Tap Prompt Ideas</span>
          {PROMPT_IDEAS.map((phrase, i) => (
            <button
              key={i}
              onClick={() => setCurrentMessage(phrase)}
              className="w-full text-left p-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-xs text-slate-300 hover:text-white transition duration-150 block truncate"
            >
              → {phrase}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
