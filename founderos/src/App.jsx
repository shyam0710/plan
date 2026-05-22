import { useState, useEffect } from 'react';
import {
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_KPIS,
  INITIAL_PIPELINE,
  INITIAL_REFLECTIONS_HISTORY,
} from './data/initial';
import { playBeep } from './utils/audio';

import Sidebar    from './components/Sidebar';
import Header     from './components/Header';
import Toast      from './components/Toast';
import TaskModal  from './components/TaskModal';
import Dashboard  from './components/tabs/Dashboard';
import AiChat     from './components/tabs/AiChat';
import Timer      from './components/tabs/Timer';
import Tasks      from './components/tabs/Tasks';
import Habits     from './components/tabs/Habits';
import Reflection from './components/tabs/Reflection';
import Kpis       from './components/tabs/Kpis';
import Insights   from './components/tabs/Insights';

export default function App() {
  // ── Navigation ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Domain state ────────────────────────────────────────────
  const [tasks,               setTasks]               = useState(INITIAL_TASKS);
  const [habits,              setHabits]              = useState(INITIAL_HABITS);
  const [kpiHistory,          setKpiHistory]          = useState(INITIAL_KPIS);
  const [pipelineMetrics,     setPipelineMetrics]     = useState(INITIAL_PIPELINE);
  const [completedSessions,   setCompletedSessions]   = useState(2);
  const [selectedTask,        setSelectedTask]        = useState(null);

  // ── Header intention ────────────────────────────────────────
  const [intention,           setIntention]           = useState('Close proposal for Acme Corp and schedule two outreach demo rounds.');
  const [tempIntention,       setTempIntention]       = useState(intention);
  const [isEditingIntention,  setIsEditingIntention]  = useState(false);

  // ── Reflection (global because Dashboard + score depend on it) ──
  const [reflection, setReflection] = useState({
    isSubmitted: false,
    aiSummary:   '',
    aiAnalysis:  '',
    energy:      8,
    mood:        8,
  });
  const [reflectionsHistory, setReflectionsHistory] = useState(INITIAL_REFLECTIONS_HISTORY);

  // ── Toast ───────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Founder score ───────────────────────────────────────────
  const calculateFounderScore = () => {
    let score = 0;
    if (intention.trim()) score += 5;

    const completedHabits = habits.filter((h) => h.completed).length;
    score += (completedHabits / habits.length) * 35;

    const todayTasks = tasks.filter((t) => t.status === 'today');
    if (todayTasks.length > 0) {
      score += (todayTasks.filter((t) => t.completed).length / todayTasks.length) * 20;
      const revTasks = todayTasks.filter((t) => t.is_revenue_generating);
      if (revTasks.length > 0)
        score += (revTasks.filter((t) => t.completed).length / revTasks.length) * 10;
    } else {
      score += 30;
    }

    score += Math.min(completedSessions * 10, 20);
    if (reflection.isSubmitted) score += 10;
    return Math.min(100, Math.round(score));
  };

  // ── Task handlers ────────────────────────────────────────────
  const toggleTaskCompleted = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    playBeep('click');
    showToast('Task completion toggled!', 'info');
  };

  const createTask = (task) => {
    setTasks((prev) => [...prev, task]);
    playBeep('complete');
    showToast('Task created successfully in Focus Today!', 'success');
  };

  const moveTaskStatus = (id, newStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    showToast(`Task moved to ${newStatus.replace('_', ' ')}`, 'info');
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);
    showToast('Task permanently deleted', 'warning');
  };

  const updateTaskField = (id, field, value) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
    setSelectedTask((prev) => (prev?.id === id ? { ...prev, [field]: value } : prev));
  };

  // ── Habit handlers ───────────────────────────────────────────
  const toggleHabitCompleted = (id) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      )
    );
    playBeep('click');
    showToast('Routine progress saved!', 'success');
  };

  const addHabit = (name) => {
    setHabits((prev) => [...prev, { id: Date.now().toString(), name, completed: false, streak: 0 }]);
    playBeep('click');
    showToast('New baseline habit established!', 'success');
  };

  // ── Reflection handlers ──────────────────────────────────────
  const submitReflection = ({ wins, losses, energy, mood }) => {
    const word = mood > 7 ? 'highly motivated' : mood > 4 ? 'balanced but focused' : 'fatigued/vulnerable';
    const aiSummary  = `Identified high momentum metrics. Accomplished key proposals with a ${word} emotional state.`;
    const aiAnalysis = `Energy logged: ${energy}/10, Mood: ${mood}/10. Correlation: High client discussion rate maintains pipeline progression, but watch distraction thresholds during late focus sessions.`;

    setReflection({ isSubmitted: true, aiSummary, aiAnalysis, energy, mood });
    setReflectionsHistory((prev) => [
      {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        wins, losses, energy, mood, aiSummary, aiAnalysis,
      },
      ...prev,
    ]);
    setHabits((prev) => prev.map((h) => (h.id === 'h5' ? { ...h, completed: true } : h)));
    playBeep('complete');
    showToast('Evening reflection analysis compiled!', 'success');
  };

  const resetReflection = () => {
    setReflection({ isSubmitted: false, aiSummary: '', aiAnalysis: '', energy: 8, mood: 8 });
    playBeep('click');
  };

  // ── KPI handlers ─────────────────────────────────────────────
  const addMetrics = ({ clients, meetings, proposals, value, revAdd }) => {
    setPipelineMetrics((prev) => ({
      ...prev,
      clientsSpoken:      prev.clientsSpoken      + clients,
      firstLevelMeetings: prev.firstLevelMeetings + meetings,
      proposalsSent:      prev.proposalsSent      + proposals,
      proposalValue:      prev.proposalValue      + value,
      totalRevenue:       prev.totalRevenue       + revAdd,
    }));
    const dateStr = new Date()
      .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      .replace('/', '-');
    setKpiHistory((prev) => [
      ...prev.slice(1),
      { date: dateStr, clientsSpoken: clients || 4, meetings: meetings || 2, proposals: proposals || 1, proposalVal: value || 5000 },
    ]);
    playBeep('complete');
    showToast('Pipeline metrics refreshed successfully!', 'success');
  };

  // ── Timer / AI injection callbacks ───────────────────────────
  const handleSessionComplete = () => {
    setCompletedSessions((c) => c + 1);
    setHabits((prev) => prev.map((h) => (h.id === 'h2' ? { ...h, completed: true } : h)));
  };

  const handleInjectTasks = (newTasks) => {
    setTasks((prev) => [...prev, ...newTasks]);
    playBeep('inject');
    showToast(`Successfully scheduled ${newTasks.length} task(s) from conversation!`, 'info');
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 font-sans flex flex-col md:flex-row antialiased select-none">

      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">

        <Header
          activeTab={activeTab}
          intention={intention}
          tempIntention={tempIntention}
          isEditingIntention={isEditingIntention}
          onSetIntention={setIntention}
          onSetTempIntention={setTempIntention}
          onSetIsEditing={setIsEditingIntention}
        />

        <div className="p-6 space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              habits={habits}
              pipelineMetrics={pipelineMetrics}
              reflection={reflection}
              currentFounderScore={calculateFounderScore()}
              onToggleTask={toggleTaskCompleted}
              onToggleHabit={toggleHabitCompleted}
              onSelectTask={setSelectedTask}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'ai-chat' && (
            <AiChat
              onInjectTasks={handleInjectTasks}
              showToast={showToast}
              onSelectTask={setSelectedTask}
            />
          )}

          {activeTab === 'timer' && (
            <Timer
              tasks={tasks}
              onSessionComplete={handleSessionComplete}
              showToast={showToast}
            />
          )}

          {activeTab === 'tasks' && (
            <Tasks
              tasks={tasks}
              onCreateTask={createTask}
              onToggleTask={toggleTaskCompleted}
              onMoveTask={moveTaskStatus}
              onDeleteTask={deleteTask}
              onSelectTask={setSelectedTask}
              showToast={showToast}
            />
          )}

          {activeTab === 'habits' && (
            <Habits
              habits={habits}
              onToggleHabit={toggleHabitCompleted}
              onAddHabit={addHabit}
            />
          )}

          {activeTab === 'reflection' && (
            <Reflection
              reflection={reflection}
              reflectionsHistory={reflectionsHistory}
              onSubmit={submitReflection}
              onReset={resetReflection}
            />
          )}

          {activeTab === 'kpis' && (
            <Kpis
              kpiHistory={kpiHistory}
              pipelineMetrics={pipelineMetrics}
              onAddMetrics={addMetrics}
            />
          )}

          {activeTab === 'insights' && <Insights />}
        </div>

        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={deleteTask}
          onUpdateField={updateTaskField}
          showToast={showToast}
        />
      )}
    </div>
  );
}
