export async function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (res.status === 429 && retries > 0) {
        await sleep(delay);
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw new Error(`HTTP ${res.status}`);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      await sleep(delay);
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const GEMINI_SYSTEM_PROMPT = `You are the ultimate strategic executive Co-Pilot for Shyam, a high-performance SaaS Founder.
Your responsibility is twofold:
1. Provide a high-caliber, brief, and highly direct response to their updates (clients spoken to, proposals sent, meetings, problems). Max 3 sentences.
2. Intelligently identify and parse ANY tasks, next steps, or meetings mentioned.

For each task you extract, identify:
- title: Actionable, concise, clear title.
- description: Detailed summary or next steps for the task.
- priority: "high", "medium", or "low".
- status: "today", "this_week", or "backlog" based on context.
- is_revenue_generating: true if directly tied to proposal preparation, sales calls, outbound meetings, proposals, or MRR.
- scheduledTime: Extracted scheduled hour (e.g. "3:00 PM").
- tags: Array of short string tags matching the context (e.g. ["proposal", "outreach", "tech"]).

You MUST respond strictly with the specified JSON schema structure. No extra text, headers, or markdown formatting outside of raw JSON representation.`;

export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    extractedTasks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title:                 { type: 'STRING' },
          description:           { type: 'STRING', nullable: true },
          priority:              { type: 'STRING', enum: ['high', 'medium', 'low'] },
          status:                { type: 'STRING', enum: ['today', 'this_week', 'backlog', 'done'] },
          is_revenue_generating: { type: 'BOOLEAN' },
          scheduledTime:         { type: 'STRING', nullable: true },
          tags:                  { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['title', 'priority', 'status', 'is_revenue_generating'],
      },
    },
  },
  required: ['reply', 'extractedTasks'],
};
