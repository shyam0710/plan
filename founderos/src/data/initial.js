export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Launch beta page for FounderOS',
    description: 'Finalize the layout styling, add custom interaction triggers, and link up with analytics dashboards.',
    priority: 'high',
    status: 'today',
    is_revenue_generating: true,
    completed: false,
    scheduledTime: '10:00 AM',
    tags: ['SaaS', 'Launch', 'Frontend'],
  },
  {
    id: '2',
    title: 'Send proposal to Acme Corp',
    description: 'Draft the tiered package proposal for the SaaS licensing. High custom priority onboarding setup.',
    priority: 'high',
    status: 'today',
    is_revenue_generating: true,
    completed: false,
    scheduledTime: '11:30 AM',
    tags: ['Proposals', 'Outreach'],
  },
  {
    id: '3',
    title: 'Follow up on first level meeting with Beta Brand',
    description: 'Book follow-up meeting and send deck outlining execution indicators.',
    priority: 'medium',
    status: 'this_week',
    is_revenue_generating: false,
    completed: false,
    tags: ['Meetings', 'Nurture'],
  },
  {
    id: '4',
    title: 'Refactor state manager logic',
    description: 'Ensure context-sensitive changes and reduce cumulative layout shifts across tabs.',
    priority: 'low',
    status: 'backlog',
    is_revenue_generating: false,
    completed: false,
    tags: ['Tech Debt', 'Optimization'],
  },
  {
    id: '5',
    title: 'Gym workout session',
    description: 'Active core routines and functional mobility work.',
    priority: 'medium',
    status: 'today',
    is_revenue_generating: false,
    completed: true,
    scheduledTime: '6:00 PM',
    tags: ['Health'],
  },
];

export const INITIAL_HABITS = [
  { id: 'h1', name: 'Wake up at 5:30 AM',    completed: true,  streak: 12 },
  { id: 'h2', name: '3+ Hours Deep Work',     completed: false, streak: 4  },
  { id: 'h3', name: 'Workout or Cardio',      completed: true,  streak: 5  },
  { id: 'h4', name: 'Content post published', completed: false, streak: 1  },
  { id: 'h5', name: 'Evening AI Reflection',  completed: false, streak: 14 },
];

export const INITIAL_KPIS = [
  { date: '05-12', clientsSpoken: 4,  meetings: 2, proposals: 1, proposalVal: 5000  },
  { date: '05-13', clientsSpoken: 6,  meetings: 3, proposals: 2, proposalVal: 12000 },
  { date: '05-14', clientsSpoken: 3,  meetings: 1, proposals: 1, proposalVal: 4500  },
  { date: '05-15', clientsSpoken: 9,  meetings: 4, proposals: 3, proposalVal: 22000 },
  { date: '05-16', clientsSpoken: 5,  meetings: 2, proposals: 2, proposalVal: 9000  },
  { date: '05-17', clientsSpoken: 8,  meetings: 5, proposals: 3, proposalVal: 18500 },
  { date: '05-18', clientsSpoken: 11, meetings: 6, proposals: 4, proposalVal: 24000 },
];

export const INITIAL_PIPELINE = {
  clientsSpoken:      45,
  firstLevelMeetings: 23,
  proposalsSent:      15,
  proposalValue:      72500,
  totalRevenue:       39200,
  revenueTarget:      60000,
};

export const INITIAL_REFLECTIONS_HISTORY = [
  {
    date: 'May 17, 2026',
    wins: 'Closed proposals for startup client. Reached 11 client demo milestones.',
    losses: 'Proposals took longer to format than scheduled.',
    energy: 7,
    mood: 9,
    aiSummary: 'Strong pipeline momentum. Conversational ratios remain high.',
    aiAnalysis:
      'Excellent productivity. Recommended strategy: schedule deep-focus blocks first thing to preserve afternoon focus.',
  },
];

export const INSIGHTS = [
  {
    type: 'positive',
    text: 'You perform best between 8–11 AM. 74% of your first-level meetings are scheduled and won in this window.',
  },
  {
    type: 'warning',
    text: 'Proposal conversion rate drops by 32% on days when consecutive screen time goes beyond 6 hours.',
  },
  {
    type: 'correlation',
    text: 'Having at least 8 client conversations in a day correlates directly with sending 2.4x more proposals.',
  },
  {
    type: 'burnout',
    text: 'High meeting volume days coincide with a 40% reduction in completed deep focus work sessions.',
  },
];
