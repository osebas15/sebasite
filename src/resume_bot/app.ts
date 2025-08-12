import dotenv from 'dotenv';
dotenv.config();

import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

// Helper to send push notification
async function push(text: string) {
  await axios.post('https://api.pushover.net/1/messages.json', {
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER,
    message: text,
  });
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

class Me {
  openai: OpenAI;
  name: string;
  summary: string;
  linkedin: string;

  constructor() {
    this.openai = new OpenAI();
    this.name = 'Sebastian Aguirre';
    // Read summary and LinkedIn from files
    const summaryPath = path.join(__dirname, 'me', 'summary.txt');
    const resumePath = path.join(__dirname, 'me', 'sebastian_aguirre_resume.txt');
    this.summary = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, 'utf-8') : '';
    this.linkedin = fs.existsSync(resumePath) ? fs.readFileSync(resumePath, 'utf-8') : '';
  }

  async handle_tool_call(tool_calls: any[]) {
    const results = [];
    for (const tool_call of tool_calls) {
      const tool_name = tool_call.function.name;
      const args = JSON.parse(tool_call.function.arguments);
      let result = {};
      if (tool_name === 'record_user_details') {
        result = await record_user_details(args.email, args.name, args.notes);
      } else if (tool_name === 'record_unknown_question') {
        result = await record_unknown_question(args.question);
      } else if (tool_name === 'send_direct_message') {
        result = await send_direct_message(args.message, args.from);
      }
      results.push({ role: "tool" as const, content: JSON.stringify(result), tool_call_id: tool_call.id });
    }
    return results;
  }

  system_prompt() {
    return `say howdy at the beggining of every response, You are acting as ${this.name}. You are answering questions on ${this.name}'s website,
    You are enabling communication with ${this.name} via push notifications and email.
    if the user wants to send a message to ${this.name}, use the send_direct_message tool to deliver their message as a push notification.
    particularly questions related to ${this.name}'s career, background, skills and experience. 
    Your responsibility is to represent ${this.name} for interactions on the website as faithfully as possible. 
    You are given a summary of ${this.name}'s background and LinkedIn profile which you can use to answer questions. 
    Be professional and engaging, as if talking to a potential client or future employer who came across the website.\n\n
    If the user wants to send a direct message to ${this.name}, use the send_direct_message tool to deliver their message as a push notification.
    If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool. 
    \n\n## Summary:\n${this.summary}\n\n## LinkedIn Profile:\n${this.linkedin}\n\nWith this context, please chat with the user, always staying in character as ${this.name}.`;
  }

  async chat(message: string, history: ChatCompletionMessageParam[]) {
    let messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: this.system_prompt() },
      ...history,
      { role: 'user', content: message },
    ];
    let done = false;
    let response: any;
    while (!done) {
      response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools,
      });
      if (response.choices[0].finish_reason === 'tool_calls') {
        const message = response.choices[0].message;
        const tool_calls = message.tool_calls;
        const results = await this.handle_tool_call(tool_calls);
        messages.push(message);
        messages.push(...results);
      } else {
        done = true;
      }
    }
    return response.choices[0].message.content;
  }
}

export default Me;
