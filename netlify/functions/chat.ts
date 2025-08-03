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

const tools: ChatCompletionTool[] = [
  { type: 'function', function: record_user_details_json },
  { type: 'function', function: record_unknown_question_json },
];

function system_prompt(summary: string, linkedin: string, name: string) {
  return `You are acting as ${name}. You are answering questions on ${name}'s website, particularly questions related to ${name}'s career, background, skills and experience. Your responsibility is to represent ${name} for interactions on the website as faithfully as possible. You are given a summary of ${name}'s background and resume which you can use to answer questions. Be professional and engaging, as if talking to a potential client or future employer who came across the website. If you don't know the answer to any question, use your record_unknown_question tool to record the question that you couldn't answer, even if it's about something trivial or unrelated to career. If the user is engaging in discussion, try to steer them towards getting in touch via email; ask for their email and record it using your record_user_details tool.\n\n## Summary:\n${summary}\n\n## LinkedIn Profile:\n${linkedin}\n\nWith this context, please chat with the user, always staying in character as ${name}.`;
}

// Optionally, you can load summary/linkedin from files or env vars
const summary = `
Today is August 2025
My name is Sebastian Aguirre. I'm a software engineer. I'm currently living near Boston, MA. but I've lived in Montgomery county, Maryland. and Medellin, Colombia.
As an engineer, I will learn and use any tools at my disposal to solve problems for my employer, client or myself.
I have strong soft skills, and can communicate technical concepts and ideas effectively with CTO's, salespeople, and junior engineers.
An achievement I'm proud of is stepping up as a software manager and the shipping integrations engineer during covid, brexit, and peak shipping season. That helped Quiet Logistics get acquired by American Eagle.
I have worn many hats during my career: I've worked Mobile, front-end, back-end, fullstack, dev-ops as required.
I'm an amateur chef, I enjoy sautéing cherry tomatoes with soy sauce and oregano. Slow cooking a pot roast and using that meat and broth for many delicious meals.
I like to play video games, if you want a good game for an engineer try factorio.
I've recently started swimming a lot.
My family is from Medellin, Colombia.
`;

const resume = `
Sebastian Aguirre	Contact me for my phone number | Weymouth, MA
EMAIL: osebas15@gmail.com	WEBSITE: https://sebasite.netlify.app/
GitHub: https://github.com/osebas15	LinkedIn: sebastian-aguirre-52ba93aa

I am a results-driven Software Engineer with over 10 years of hands-on experience in designing, and developing high-performance applications across diverse tech stacks. I take pride in applying my technical expertise and continuously improving to deliver scalable solutions that align with a company’s mission and vision. Committed to lifelong learning, I experiment with technologies and concepts that pique my interest, and I’m eager to contribute to a dynamic, collaborative team. I aim to leverage my experience to support and advance the company’s strategic vision and goals.

TECHNOLOGIES USED: iOS (SwiftUI/Objective-C/Cocoapods/XCode), Javascript (React Native, Node, Typescript), C# (ASP.NET), GIT, SQL, AWS, Azure, Firebase

PROFESSIONAL EXPERIENCE & SELECTED ACHIEVEMENTS

Medical Sabbatical	November 2023 - July 2025
Took time off for medical treatment and achieved full recovery. During this time, I focused on independent development projects across multiple stacks. My most recent project is focused on experimenting and retooling with machine learning programming tools such as GitHub Copilot, Antrophics Claude, and OpenAI ChatGPT.
My most recent project: https://github.com/osebas15/prompt-board
Focus for my research: https://github.com/osebas15/prompt-board/tree/main/prompts
See it live: prompt-board.netlify.app

LogixHealth – Bedford, MA (contract)	August 2023 - November 2023
Mobile Applications Engineer Main Focus: Piloting a mobile development business unit
Discussed requirements and architectural needs with Platform Architect
Defined a Jira Epic with the Project Manager for the mobile app development
Mentored and worked with international (Indian and Polish) team members
Created and iterated through a SwiftUI POC (iPhone and Apple Watch) to help the product owners and designers ideate features and mobile design
Worked with IT team to recover and securely set up Apple developer and Google play accounts
Converted an Angular web app into a capacitor.js app, repurposing the web UI for a quick Android implementation
Planned testing for mobile applications with the Head of QA

Bento Dental – Boston, MA	June 2022 - December 2022
Mobile Team Lead – Point of Contact Mobile App Main Focus: manage and improve critical product
Reported directly to CTO
Managed and worked closely with very talented Polish colleagues
Discuss purpose and goals of mobile team and mobile app with CEO and CTO
Identified the signup flow as a user pain point, and was the main driver in its improvement Epic
Ensured and expanded security for the mobile app during a SOC 2 audit
Joined strategy meetings as the mobile SME with VP of Sales 
Received HIPAA certification and maintained compliance for the mobile app

QuietLogistics – Devens, MA	April 2019 - June 2022
Software Manager & Senior Engineer Main Focus: Maintaining and expanding mission critical systems
Developed and managed enterprise stack utilizing C#/ASP.NET and SQL
Was shipping and logistics technology SME for logistics company
Provided highest technical escalation resolutions for clients
Collaborated with stakeholders to identify and implement key features
Mentored and trained new engineers
Migrated to and managed Git repositories
Experienced our teams growth into an agile team
Managed our AWS S3 client interface
Created automated build pipeline in Azure for the iOS app and other systems

NXVTech - Jamaica Plain, MA                                                 	September 2017 -  February 2019 
Software Developer Main Focus: Enabling initial app communication between drivers and the police officers who stopped them
Designed and built the app from customer specifications
Wrote and managed a full stack application
Leveraged Google Firebase to host a react portal, noSQL DB and a REST API server for the mobile app
Managed the Apple Developer account
Implemented push notifications using firebase (sending/receiving) 

Freelance Software Developer 	August 2016 - August 2017
Main Focus: Working with non-developers to enhance their creative vision and every-day tasks by using specified apps
Utilized AWS to create an iOS notification service
Taught clients Git for faster feature iteration
Worked with clients to design apps to their specifications and needs
Developed apps using multiple platforms and technologies

Zobreus - Cambridge, MA	September 2014 - June 2016
Software Developer Main Focus: Bridging data between health care systems and patient health record portals
Gained insight into the inception and growth of a startup 
Learned Objective-C and Swift and how to interpolate between them
Gained an understanding of sound UI design principles
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
