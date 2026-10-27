export interface Link {
  label: string;
  href: string;
}

export interface Proof {
  value: string;
  caption: string;
}

export interface ClientWork {
  client: string;
  summary: string;
  bullets: string[];
  metric?: string;
  stack: string[];
}

export interface Job {
  company: string;
  location?: string;
  dates: string;
  role?: string;
  bullets: string[];
  clients?: ClientWork[];
}

export interface SkillRow {
  label: string;
  items: string[];
}

export const profile = {
  name: 'Sebastian Aguirre',
  title: 'Full Stack & Mobile Engineer',
  location: 'Boston, MA',
  email: 'osebas15@gmail.com',
  website: 'https://sebasite.netlify.app/',
  resumePdf: '/me/Sebastian_Aguirre_Resume_2026.pdf',
  updated: 'Oct 2026',
  links: {
    github: { label: 'github.com/osebas15', href: 'https://github.com/osebas15' },
    linkedin: {
      label: 'linkedin.com/in/sebastian-aguirre-52ba93aa',
      href: 'https://www.linkedin.com/in/sebastian-aguirre-52ba93aa/',
    },
  },
  tagline:
    'I take features from idea to shipped — iOS, web, and enterprise software for startups and Fortune 500 brands.',
  summary:
    "Full stack engineer with 10+ years of experience building iOS, web, and enterprise software for startups and Fortune 500 brands. I take a feature from idea to shipped work on my own, with a strong focus on quality: I've replatformed consumer apps used by millions of people daily, caught and fixed security issues before they reached users, and set up AI-assisted development practices (Claude, LLM coding workflows) that help teams ship faster. I communicate clearly with stakeholders, pick up new tools quickly, and choose the right solution for each client.",
  proof: [
    { value: '10+ yrs', caption: 'Shipping iOS, web, and enterprise software' },
    { value: 'Millions', caption: 'Daily users on an app I replatformed to React Native' },
    { value: '$3M', caption: 'Revenue recaptured with Brexit compliance changes' },
    { value: '1M+', caption: 'Packages through shipping systems I led, in 4 months' },
  ] as Proof[],
  skills: [
    { label: 'Languages', items: ['Swift', 'TypeScript', 'JavaScript', 'C#', 'Objective-C', 'SQL'] },
    {
      label: 'Mobile',
      items: ['SwiftUI', 'SwiftData', 'UIKit', 'React Native', 'Capacitor.js', 'iOS', 'iPadOS', 'watchOS', 'Android'],
    },
    { label: 'Web / Cloud', items: ['React', 'Node.js', 'ASP.NET', 'AWS', 'Azure', 'Firebase'] },
    {
      label: 'AI',
      items: [
        'Claude skills & agentic coding workflows',
        'LLM-assisted development',
        'ChatGPT apps & connectors',
      ],
    },
    { label: 'Tools', items: ['Git', 'GitHub Actions', 'Bitrise', 'Azure Pipelines', 'Jira'] },
  ] as SkillRow[],
  jobs: [
    {
      company: 'TELUS Digital',
      location: 'Boston, MA',
      dates: 'Sep 2025 – Oct 2026',
      role: 'Full Stack Engineer — consulting for enterprise media and hospitality clients',
      bullets: [],
      clients: [
        {
          client: 'Wyndham Hotels & Resorts',
          summary: 'Replatformed a native mobile app used by millions of people daily to React Native.',
          bullets: [
            'Replatformed a native mobile app used by millions of people daily to React Native.',
            'Built a set of Claude skills that let the team iterate on bug fixes and new features much faster.',
            'Tracked down a memory leak and cut memory growth by about 40%.',
            'Helped reach a 95% UAT bug closure rate ahead of a hard release deadline.',
          ],
          metric: '−40% memory growth',
          stack: ['React Native', 'Claude skills', 'Mobile'],
        },
        {
          client: 'News Corp / Dow Jones',
          summary: 'Prototyped the Dow Jones ChatGPT connector on a lean AI team.',
          bullets: [
            'Worked on a lean AI team to prototype the Dow Jones ChatGPT connector.',
            'Found and fixed a critical security flaw in the MarketWatch ChatGPT app before handoff.',
          ],
          metric: 'Critical security fix',
          stack: ['ChatGPT apps', 'Connectors', 'AI'],
        },
        {
          client: 'McClatchy',
          summary: 'Maintained a white-label news app that powers many local newspaper brands.',
          bullets: [
            'Maintained a white-label news app that powers many local newspaper brands.',
            "Helped set up the team's LLM-assisted coding practices, improving development speed and code quality.",
          ],
          metric: 'One app, many brands',
          stack: ['Mobile', 'White-label', 'LLM-assisted dev'],
        },
      ],
    },
    {
      company: 'LogixHealth',
      location: 'Bedford, MA (contract)',
      dates: 'Aug 2023 – Nov 2023',
      role: 'Mobile Applications Engineer — helped launch a new mobile development business unit',
      bullets: [
        'Helped leadership set up the iOS business unit and led stakeholder meetings to define the product roadmap.',
        'Quickly prototyped iPhone and Apple Watch concepts in SwiftUI so product owners and designers could explore features.',
        'Converted an Angular web app into a cross-platform Capacitor.js mobile app.',
        'Planned mobile QA strategy with the head of QA; recovered and secured the Apple Developer and Google Play accounts.',
      ],
    },
    {
      company: 'Bento Dental',
      location: 'Boston, MA',
      dates: 'Jun 2022 – Dec 2022',
      role: 'Mobile Team Lead — owned the mobile app end to end',
      bullets: [
        'Strengthened mobile app security during a SOC 2 audit and maintained HIPAA compliance.',
        'Identified the signup flow as a key pain point for users and helped redesign it.',
        'Optimized the Bitrise CI/CD pipeline; managed App Store and Play Store releases.',
      ],
    },
    {
      company: 'Quiet Logistics',
      location: 'Devens, MA',
      dates: 'Apr 2019 – Jun 2022',
      role: 'Senior Software Engineer (promoted from Mobile Applications Developer)',
      bullets: [
        'Shipping subject-matter expert; led shipping engineering through 1M+ packages in 4 months.',
        'Delivered Brexit compliance changes that recaptured $3M in revenue.',
        'Helped the company get acquired by American Eagle Outfitters.',
        'Became the lead engineer when the software manager left at a critical time for the business, keeping essential C#/ASP.NET and SQL systems running.',
        'Built an Azure CI/CD pipeline for the iOS app and other systems; led the migration to Git; managed the AWS S3 client interface.',
        'Mentored new engineers and helped the team move to agile development.',
      ],
    },
    {
      company: 'NXVTech',
      location: 'Jamaica Plain, MA',
      dates: 'Sep 2017 – Feb 2019',
      role: 'Software Developer — app to ease tensions between police and communities',
      bullets: [
        'Designed and built a full stack app from customer specs: a React portal, a NoSQL database, and a REST API on Firebase, plus push notifications.',
      ],
    },
    {
      company: 'Freelance Developer',
      dates: 'Aug 2016 – Aug 2017',
      bullets: [
        'Built apps for non-technical clients across multiple platforms, including an AWS-backed iOS notification service; taught clients Git so they could iterate on features faster.',
      ],
    },
    {
      company: 'Zobreus',
      location: 'Cambridge, MA',
      dates: 'Sep 2014 – Jun 2016',
      bullets: [
        'Early-stage health-tech startup connecting care providers and patients; built iOS features in Objective-C and Swift.',
      ],
    },
  ] as Job[],
  personal: [
    "I've lived near Boston, in Montgomery County, Maryland, and in Medellín, Colombia, where my family is from.",
    "I'm an amateur chef: cherry tomatoes sautéed with soy sauce and oregano, and slow-cooked pot roast that turns into many meals.",
    'If you want a good game for an engineer, try Factorio.',
    "I've recently started swimming a lot.",
  ],
  // Context for the chat bot that isn't shown on the page.
  aboutForChat: [
    'As an engineer, I will learn and use any tools at my disposal to solve problems for my employer, client, or myself.',
    'I have strong soft skills, and can communicate technical concepts and ideas effectively with CTOs, salespeople, and junior engineers.',
    "An achievement I'm proud of is stepping up as lead engineer and the shipping integrations engineer during COVID, Brexit, and peak shipping season. That helped Quiet Logistics get acquired by American Eagle Outfitters.",
    "I have worn many hats during my career: I've worked mobile, front-end, back-end, full stack, and dev-ops as required.",
  ],
};

export function resumeAsText(): string {
  const p = profile;
  const lines: string[] = [
    p.name,
    p.title,
    `${p.location} | ${p.email} | Website: ${p.website}`,
    `GitHub: ${p.links.github.href} | LinkedIn: ${p.links.linkedin.href}`,
    '',
    'SUMMARY',
    p.summary,
    '',
    'TECHNICAL SKILLS',
    ...p.skills.map((s) => `${s.label}: ${s.items.join(', ')}`),
    '',
    'EXPERIENCE',
  ];
  for (const job of p.jobs) {
    lines.push('', `${job.company}${job.location ? ` — ${job.location}` : ''} (${job.dates})`);
    if (job.role) lines.push(job.role);
    for (const c of job.clients ?? []) {
      lines.push(c.client, ...c.bullets.map((b) => `- ${b}`));
    }
    lines.push(...job.bullets.map((b) => `- ${b}`));
  }
  return lines.join('\n');
}

export function summaryAsText(): string {
  return [
    `My name is ${profile.name}. I'm a ${profile.title.toLowerCase()} based in ${profile.location}.`,
    ...profile.aboutForChat,
    ...profile.personal,
  ].join('\n');
}
