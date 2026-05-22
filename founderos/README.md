# FounderOS — AI Pipeline Core

A personal founder OS for managing outbound pipeline, deep work sessions, habits, and AI-assisted task scheduling.

## Tech stack

- **React 18** — UI
- **Vite** — dev server & build
- **Tailwind CSS 3** — styling
- **Gemini 2.0 Flash** — AI Co-Pilot chat + auto task extraction

---

## Quick start

### 1. Install dependencies

```bash
cd founderos
npm install
```

### 2. Add your Gemini API key

```bash
cp .env.example .env
# then edit .env and paste your key:
# VITE_GEMINI_API_KEY=your_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

The AI Co-Pilot chat tab will show an offline message until the key is set.  
All other tabs work without a key.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the built output locally
```

> **API key note:** `VITE_*` env vars are embedded in the browser bundle at build time.  
> For a production deployment where the key must stay secret, proxy the Gemini call  
> through your own backend endpoint and remove `VITE_GEMINI_API_KEY` from the frontend.

---

## Project structure

```
founderos/
├── index.html                  # Vite entry HTML
├── .env.example                # env var template (copy to .env)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component — all domain state lives here
    ├── index.css               # Global styles (Tailwind directives, scrollbar, range)
    ├── data/
    │   └── initial.js          # Seed data: tasks, habits, KPIs, insights
    ├── utils/
    │   ├── audio.js            # Web Audio API beep helper
    │   └── api.js              # fetchWithBackoff + Gemini schema constants
    └── components/
        ├── Sidebar.jsx         # Navigation sidebar
        ├── Header.jsx          # Top bar with focus intention editor
        ├── Toast.jsx           # Notification overlay
        ├── TaskModal.jsx       # Task detail / edit modal
        └── tabs/
            ├── Dashboard.jsx   # Overview: score, pipeline, tasks, habits
            ├── AiChat.jsx      # Gemini chat with auto task injection
            ├── Timer.jsx       # Pomodoro / deep focus timer
            ├── Tasks.jsx       # Kanban task board with search & tag filters
            ├── Habits.jsx      # Habit streak tracker
            ├── Reflection.jsx  # Daily reflection journal + history
            ├── Kpis.jsx        # Pipeline metric logging + bar charts
            └── Insights.jsx    # AI performance correlation cards
```

## State architecture

All domain state (`tasks`, `habits`, `kpiHistory`, `pipelineMetrics`, `reflection`, `completedSessions`) lives in `App.jsx` and flows down as props.  
Tab components own only their local UI state (form inputs, filters).  
`selectedTask` is also global so the `TaskModal` overlay can be triggered from any tab.
