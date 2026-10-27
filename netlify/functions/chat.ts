import axios from 'axios';
// Helper to send push notification (Pushover)
async function push(text: string) {
  if (!process.env.PUSHOVER_TOKEN || !process.env.PUSHOVER_USER) return;
  try {
    await axios.post('https://api.pushover.net/1/messages.json', {
      token: process.env.PUSHOVER_TOKEN,
      user: process.env.PUSHOVER_USER,
      message: text,
    });
  } catch (err) {
    console.log(err)
    // Ignore push errors 
  }
}

// Tool functions
async function record_user_details(email: string, name = 'Name not provided', notes = 'not provided') {
  await push(`Recording ${name} with email ${email} and notes ${notes}`);
  return { recorded: 'ok' };
}

async function record_unknown_question(question: string) {
  await push(`Recording ${question}`);
  return { recorded: 'ok' };
}

// New tool: send direct message as push notification
async function send_direct_message(message: string, from: string = 'Anonymous') {
  await push(`Direct message from ${from}: ${message}`);
  return { sent: 'ok' };
}
import { OpenAI } from 'openai';
import { profile, resumeAsText, summaryAsText } from '../../src/content/profile';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

// Tool schemas
const record_user_details_json = {
  name: 'record_user_details',
  description: 'Use this tool to record that a user is interested in being in touch and provided an email address',
  parameters: {
    type: 'object',
    properties: {
      email: { type: 'string', description: "The email address of this user" },
      name: { type: 'string', description: "The user's name, if they provided it" },
      notes: { type: 'string', description: "Any additional information about the conversation that's worth recording to give context" },
    },
    required: ['email'],
    additionalProperties: false,
  },
};

const record_unknown_question_json = {
  name: 'record_unknown_question',
  description: "Always use this tool to record any question that couldn't be answered as you didn't know the answer",
  parameters: {
    type: 'object',
    properties: {
      question: { type: 'string', description: "The question that couldn't be answered" },
    },
    required: ['question'],
    additionalProperties: false,
  },
};

const send_direct_message_json = {
  name: 'send_direct_message',
  description: 'Use this tool to send a direct message from the user as a push notification. Use if the user wants to send a message directly to Sebastian.',
  parameters: {
    type: 'object',
    properties: {
      message: { type: 'string', description: 'The message the user wants to send.' },
      from: { type: 'string', description: 'The name or identifier of the sender, if provided.' },
    },
    required: ['message'],
    additionalProperties: false,
  },
};

const tools: ChatCompletionTool[] = [
  { type: 'function', function: record_user_details_json },
  { type: 'function', function: record_unknown_question_json },
  { type: 'function', function: send_direct_message_json },
];

function system_prompt(summary: string, resume: string, name: string) {
  return `today is ${new Date().toLocaleDateString()}. You are a large language model pretending to be ${name}. 
  You are acting as ${name} and are allowed to break the fourth wall when its appropriate for a response. 
  If appropriate for a response you can stop acting like ${name} and take on the persona of a helpfull large language model assitant. 
  You are answering questions on ${name}'s website, particularly questions related to ${name}'s career, background, skills and experience. 
  Your responsibility is to represent ${name} for interactions on the website. You are given a summary of ${name}'s background and resume which you can use to answer questions. 
  Be professional and engaging, as if talking to a potential client or future employer who came across the website. If you don't know the answer to any question, 
  use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. 
  If the user wants to send a message to ${name}, use the send_direct_message tool to deliver their message as a push notification.
  If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool.
  \n\n## Summary:\n${summary}\n\n## Resume:\n${resume}\n\nWith this context, please chat with the user, always staying in character as ${name}.`;
}

const summary = summaryAsText();
const resume = resumeAsText();
const name = profile.name;

const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOOL_ROUNDS = 3;
const MAX_COMPLETION_TOKENS = 500;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 15;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://sebasite.netlify.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  // Netlify deploy previews and local dev
  return /^https:\/\/[a-z0-9-]+--sebasite\.netlify\.app$/.test(origin)
    || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

// Best effort only: state lives per warm function instance. The OpenAI budget cap is the real limit.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function sanitizeMessages(raw: unknown): ChatCompletionMessageParam[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned = raw
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}

function json(statusCode: number, body: object): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(event.headers.origin || event.headers.Origin)) {
    return json(403, { error: 'Forbidden' });
  }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  if (isRateLimited(ip)) {
    return json(429, { error: 'Too many messages. Please wait a minute and try again.' });
  }

  if ((event.body || '').length > MAX_BODY_BYTES) {
    return json(413, { error: 'Conversation is too long. Please refresh and start a new one.' });
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const messages = sanitizeMessages(body?.messages);
  if (!messages) {
    return json(400, { error: 'Missing or invalid messages' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return json(503, { error: 'The AI assistant is unavailable right now.' });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let chatMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: system_prompt(summary, resume, name) },
    ...messages,
  ];

  try {
    let response: any;
    for (let round = 0; ; round++) {
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: MAX_COMPLETION_TOKENS,
        // On the last allowed round, force a plain text answer.
        ...(round < MAX_TOOL_ROUNDS ? { tools } : {}),
      });
      const choice = response.choices[0];
      if (round < MAX_TOOL_ROUNDS && choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
        const tool_calls = choice.message.tool_calls;
        const toolResults: ChatCompletionMessageParam[] = [];
        for (const tool_call of tool_calls) {
          const tool_name = tool_call.function.name;
          let args: any;
          try {
            args = JSON.parse(tool_call.function.arguments);
          } catch {
            toolResults.push({
              role: 'tool',
              content: JSON.stringify({ error: 'invalid arguments' }),
              tool_call_id: tool_call.id,
            } as ChatCompletionMessageParam);
            continue;
          }
          let result = {};
          if (tool_name === 'record_user_details') {
            result = await record_user_details(args.email, args.name, args.notes);
          } else if (tool_name === 'record_unknown_question') {
            result = await record_unknown_question(args.question);
          } else if (tool_name === 'send_direct_message') {
            result = await send_direct_message(args.message, args.from);
          }
          toolResults.push({
            role: 'tool',
            content: JSON.stringify(result),
            tool_call_id: tool_call.id,
          } as ChatCompletionMessageParam);
        }
        // Add the tool call message and tool results to the chat history
        chatMessages.push(choice.message);
        chatMessages.push(...toolResults);
        // Continue the loop to let the model respond to the tool results
      } else {
        break;
      }
    }
    return json(200, { content: response.choices[0].message.content });
  } catch (err: any) {
    console.error('Chat completion failed:', err?.status, err?.message);
    const providerUnavailable = [401, 403, 429].includes(err?.status);
    return json(providerUnavailable ? 503 : 500, { error: 'The AI assistant is unavailable right now.' });
  }
};
