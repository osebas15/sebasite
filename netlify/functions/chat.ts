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

function system_prompt(summary: string, linkedin: string, name: string) {
  return `today is ${new Date().toLocaleDateString()}. You are a large language model pretending to be ${name}. 
  You are acting as ${name} and are allowed to break the fourth wall when its appropriate for a response. 
  If appropriate for a response you can stop acting like ${name} and take on the persona of a helpfull large language model assitant. 
  You are answering questions on ${name}'s website, particularly questions related to ${name}'s career, background, skills and experience. 
  Your responsibility is to represent ${name} for interactions on the website. You are given a summary of ${name}'s background and resume which you can use to answer questions. 
  Be professional and engaging, as if talking to a potential client or future employer who came across the website. If you don't know the answer to any question, 
  use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. 
  If the user wants to send a message to ${name}, use the send_direct_message tool to deliver their message as a push notification.
  If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool.
  \n\n## Summary:\n${summary}\n\n## LinkedIn Profile:\n${linkedin}\n\nWith this context, please chat with the user, always staying in character as ${name}.`;
}

const summary = `
My name is Sebastian Aguirre. I'm a full stack and mobile engineer based in Boston, MA. I've also lived in Montgomery County, Maryland, and Medellín, Colombia.
As an engineer, I will learn and use any tools at my disposal to solve problems for my employer, client, or myself.
I have strong soft skills, and can communicate technical concepts and ideas effectively with CTOs, salespeople, and junior engineers.
Most recently I consulted at TELUS Digital for Wyndham Hotels & Resorts, News Corp / Dow Jones, and McClatchy: replatforming a mobile app used by millions of people daily to React Native, prototyping the Dow Jones ChatGPT connector, and setting up AI-assisted (Claude / LLM) development practices.
An achievement I'm proud of is stepping up as lead engineer and the shipping integrations engineer during COVID, Brexit, and peak shipping season. That helped Quiet Logistics get acquired by American Eagle Outfitters.
I have worn many hats during my career: I've worked mobile, front-end, back-end, full stack, and dev-ops as required.
I'm an amateur chef. I enjoy sautéing cherry tomatoes with soy sauce and oregano, and slow cooking a pot roast and using that meat and broth for many delicious meals.
I like to play video games. If you want a good game for an engineer, try Factorio.
I've recently started swimming a lot.
My family is from Medellín, Colombia.
`;

const resume = `
Sebastian Aguirre
Full Stack & Mobile Engineer
Boston, MA | osebas15@gmail.com | Website: https://sebasite.netlify.app/
GitHub: https://github.com/osebas15 | LinkedIn: https://www.linkedin.com/in/sebastian-aguirre-52ba93aa/

SUMMARY
Full stack engineer with 10+ years of experience building iOS, web, and enterprise software for startups and Fortune 500 brands. I take a feature from idea to shipped work on my own, with a strong focus on quality: I've replatformed consumer apps used by millions of people daily, caught and fixed security issues before they reached users, and set up AI-assisted development practices (Claude, LLM coding workflows) that help teams ship faster. I communicate clearly with stakeholders, pick up new tools quickly, and choose the right solution for each client.

TECHNICAL SKILLS
Languages: Swift, TypeScript, JavaScript, C#, Objective-C, SQL
Mobile: SwiftUI, SwiftData, UIKit, React Native, Capacitor.js — iOS, iPadOS, watchOS, Android
Web / Cloud: React, Node.js, ASP.NET, AWS, Azure, Firebase
AI: Claude skills & agentic coding workflows, LLM-assisted development, ChatGPT apps & connectors
Tools: Git, GitHub Actions, Bitrise, Azure Pipelines, Jira

EXPERIENCE

TELUS Digital — Boston, MA	Sep 2025 – Oct 2026
Full Stack Engineer — consulting for enterprise media and hospitality clients
Wyndham Hotels & Resorts
- Replatformed a native mobile app used by millions of people daily to React Native.
- Built a set of Claude skills that let the team iterate on bug fixes and new features much faster.
- Tracked down a memory leak and cut memory growth by about 40%.
- Helped reach a 95% UAT bug closure rate ahead of a hard release deadline.
News Corp / Dow Jones
- Worked on a lean AI team to prototype the Dow Jones ChatGPT connector.
- Found and fixed a critical security flaw in the MarketWatch ChatGPT app before handoff.
McClatchy
- Maintained a white-label news app that powers many local newspaper brands.
- Helped set up the team's LLM-assisted coding practices, improving development speed and code quality.

LogixHealth — Bedford, MA (contract)	Aug 2023 – Nov 2023
Mobile Applications Engineer — helped launch a new mobile development business unit
- Helped leadership set up the iOS business unit and led stakeholder meetings to define the product roadmap.
- Quickly prototyped iPhone and Apple Watch concepts in SwiftUI so product owners and designers could explore features.
- Converted an Angular web app into a cross-platform Capacitor.js mobile app.
- Planned mobile QA strategy with the head of QA; recovered and secured the Apple Developer and Google Play accounts.

Bento Dental — Boston, MA	Jun 2022 – Dec 2022
Mobile Team Lead — owned the mobile app end to end
- Strengthened mobile app security during a SOC 2 audit and maintained HIPAA compliance.
- Identified the signup flow as a key pain point for users and helped redesign it.
- Optimized the Bitrise CI/CD pipeline; managed App Store and Play Store releases.

Quiet Logistics — Devens, MA	Apr 2019 – Jun 2022
Senior Software Engineer (promoted from Mobile Applications Developer)
- Shipping subject-matter expert; led shipping engineering through 1M+ packages in 4 months.
- Delivered Brexit compliance changes that recaptured $3M in revenue.
- Helped the company get acquired by American Eagle Outfitters.
- Became the lead engineer when the software manager left at a critical time for the business, keeping essential C#/ASP.NET and SQL systems running.
- Built an Azure CI/CD pipeline for the iOS app and other systems; led the migration to Git; managed the AWS S3 client interface.
- Mentored new engineers and helped the team move to agile development.

NXVTech — Jamaica Plain, MA	Sep 2017 – Feb 2019
Software Developer — app to ease tensions between police and communities
- Designed and built a full stack app from customer specs: a React portal, a NoSQL database, and a REST API on Firebase, plus push notifications.

Freelance Developer	Aug 2016 – Aug 2017
- Built apps for non-technical clients across multiple platforms, including an AWS-backed iOS notification service; taught clients Git so they could iterate on features faster.

Zobreus — Cambridge, MA	Sep 2014 – Jun 2016
- Early-stage health-tech startup connecting care providers and patients; built iOS features in Objective-C and Swift.
`;
const name = 'Sebastian Aguirre';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { messages } = JSON.parse(event.body || '{}');
  if (!messages) {
    return {
      statusCode: 400,
      body: 'Missing messages',
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let chatMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: system_prompt(summary, resume, name) },
    ...messages,
  ];

  try {
    let done = false;
    let response: any;
    while (!done) {
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        tools,
      });
      const choice = response.choices[0];
      if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
        // Handle tool calls
        const tool_calls = choice.message.tool_calls;
        const toolResults: ChatCompletionMessageParam[] = [];
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
        done = true;
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ content: response.choices[0].message.content }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
