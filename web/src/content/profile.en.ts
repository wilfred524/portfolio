/**
 * English content — the default language of the site.
 *
 * Structure is fixed by `types.ts`; the `satisfies Profile` at the bottom guarantees this
 * file and `profile.es.ts` stay in sync. Add a key in one and typecheck fails until the
 * other has it too.
 *
 * Terms deliberately NOT translated from the Spanish source: `guards`, `policies` and
 * `middleware` are Laravel class names, and "libranza" becomes "payroll-deduction
 * lending", which is the term a lender outside Colombia would recognise.
 */
import type { Profile } from './types';

export const en = {
  name: 'Wilfred Morales',
  role: 'Backend developer',
  stack: 'PHP/Laravel · PostgreSQL · Python',
  credential:
    'Configurable business logic, integrations with external services and batch processing, in production.',
  availability: 'Available now · Looking for my next role as a backend developer',
  trajectory: 'Remote · Colombia (GMT-5)',
  /* Kept as a three-beat lockup with the nexus in italics, like the Spanish original.
     A literal "Ideas made Product" reads wrong in English. */
  heroSlogan: { start: 'Ideas', link: 'into', end: 'Product' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  repoUrl: 'https://github.com/wilfred524/portfolio',
  /** Dominio de producción en Vercel; sin dominio propio todavía. */
  siteUrl: 'https://portfolio-wilfred524.vercel.app',
  cv: { label: 'Download CV', url: '/Wilfred-Morales-Backend-Developer.pdf' },
  colophon:
    'This site is React and TypeScript, with variable type and animations written by hand. The assistant runs on Python in serverless functions, with its knowledge base in versioned text files. I write leaning on AI: I define the architecture, give the instructions and verify every step. The code is public.',
  facts: [
    {
      label: 'Education',
      value:
        'Computer Engineering, Universidad Nacional Experimental del Táchira (UNET). Currently in 7th semester.',
    },
    {
      label: 'Languages and certifications',
      /* Merged: two rows for three short facts split the block for nothing. */
      value:
        'Spanish (native) · English B2 (EF SET) · Google IT Automation with Python — Coursera (in progress)',
    },
    {
      label: 'Work mode',
      /* No mention of documents, visas or sponsorship: unrequested data that invites
         filtering by nationality before reading anything technical. */
      value:
        'Remote · GMT-5 · Local employment in Colombia or international contracting via Deel.',
    },
    {
      label: 'Domain',
      value:
        'Payroll-deduction lending: loans repaid through automatic salary deductions, a regulated sector in Colombia (Law 1527).',
    },
  ],
  /*
   * Only what is backed by shipped work or a public project. Hexagonal Architecture,
   * DDD, MFA and session management, SAST and secret detection, pytest and CI/CD with
   * GitHub Actions were removed: none of them is supported by delivered work, and a
   * skill that cannot be defended in an interview costs more than it adds. The
   * "Security" category goes with them; what did happen lives under "Access control".
   */
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP / Laravel',
        'PostgreSQL / SQL',
        'MySQL',
        'Python',
        'Node.js',
      ],
    },
    {
      area: 'Architecture',
      items: ['Layered architecture (domain, application, persistence)'],
    },
    {
      area: 'Access control',
      items: ['Roles and permissions (Spatie)', 'reCAPTCHA Enterprise'],
    },
    {
      area: 'Automation & AI',
      items: ['DeepSeek API', 'OpenAI API', 'n8n', 'API and webhook integration'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade'],
    },
    {
      area: 'Infrastructure',
      items: ['Docker', 'Linux / Nginx', 'GCP', 'AWS S3', 'Certbot'],
    },
  ],
  employments: [
    {
      id: 'gaf',
      employer: 'GAF Technology Solutions',
      /* Places the company and the team size: on a team of 4, "backend developer"
         means touching infrastructure and deployment, not just endpoints. */
      tagline:
        'Payroll-deduction lending fintech. Technology team of 4: 2 developers, a tech lead, and an infrastructure and security lead. Applications are originated by CK Comercializadora, a company in the same group.',
      role: 'Backend developer',
      period: 'Oct 2025 – Jul 2026',
      mode: 'Fixed-term project contract · Remote, Colombia',
    },
  ],
  projectGroups: [
    {
      category: 'CK Comercializadora',
      employmentId: 'gaf',
      /* One single way of naming the relationship with CK, here and in the employment
         tagline: alternating "subsidiary" and "group company" read like two things. */
      note: 'Company in the same group',
      items: [
        {
          id: 'rules-engine',
          title: 'Credit rules engine',
          body: {
            problem:
              'Changing a credit policy meant a deployment: the business team could not adjust a term limit or a garnishment condition without going through development.',
            hard:
              'I modelled the data and translated business policy into a rules schema in PostgreSQL (eligibility, garnishments, term limits, employment and financial requirements per payer), so the code does not know what the rules are, only how to apply them. On top of that I implemented the full evaluation: borrowing-capacity calculation under Law 1527 (payroll-deduction lending) and Law 50 for active employees and pensioners, decision criteria, special rules, application re-evaluation, and the front-end and back-end validation.',
            result:
              'The business team adjusts parameters without touching code or waiting for a deployment, and every application is traced back to the advisor who filed it. A colleague built the submission API; I restructured its request body several times as the model changed.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
      ],
    },
    {
      category: 'GAF platform',
      employmentId: 'gaf',
      items: [
        {
          id: 'esignature',
          title: 'Electronic signature with identity validation',
          body: {
            problem:
              'The previous module was disused and the document — 24 pages — was filled in by hand. I built the module from scratch: it is now generated automatically from templates, with a different template per product.',
            hard:
              'The hard part is not signing, it is getting everything to line up before signing. An advisor approves a draft, customer data is validated against TransUnion, and identity is verified by OTP or KBA. I designed the flow as a state machine over the asynchronous responses from the provider, so a long process always ends in a valid document, or in an error the user can act on.',
            result:
              'The provider returns the signed document with its hash, the transaction is fully traceable, and a copy is kept in S3. The whole procedure closes in about 20 minutes, against a manual fill-in of 24 pages.',
          },
          tags: ['Laravel', 'Vue.js', 'Python', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
          title: 'Monthly credit scoring process',
          metric: 'Over 320,000 distinct people per run, once a month',
          body: {
            problem:
              'A risk model lived in a script owned by the risk team, with no way to reach production.',
            hard:
              'I packaged it into a container with a monthly cron: it reads from PostgreSQL, runs the model, checks the artifact has been regenerated before going further, and loads in batches of 5,000 to bound each statement. The process is idempotent and resumable, and discards invalid rows without aborting the whole load.',
            result:
              'The model is not mine; the plumbing that puts it in production is. Over 320,000 distinct people are scored on every run, with no manual step.',
          },
          tags: ['Python', 'PostgreSQL', 'Docker', 'Laravel'],
        },
        {
          id: 'access-control',
          title: 'Access control and permissions',
          brief:
            'I built the platform permission tree across 17 modules, with permissions down to the option and sub-process level, locked down every route, and migrated existing users and roles to the new schema without interrupting operations.',
          tags: ['Spatie Permission', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'layered-migration',
          title: 'Migration to a layered architecture',
          brief:
            'I took part in the first stage of migrating the platform — six years of code — to a layered architecture, verifying every change module by module before moving on and removing raw SQL queries from controllers entirely. Three months of work, reviewed by the tech lead at each step.',
          tags: ['Layered architecture', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'infrastructure',
          title: 'Infrastructure and deployment',
          body: {
            problem:
              'The application ran natively on the machine, with no isolation between environment and code.',
            hard:
              'I containerised the application with Docker and deployed it on a new GCP instance, with nginx as a reverse proxy between the containers and the host.',
            result:
              'I ran the migration in parallel: I brought up and validated the new instance while the old one was still in production, configured the domain DNS and issued the certificates with Certbot until the application ran entirely over HTTPS. No service interruption.',
          },
          tags: ['Docker', 'Linux / Nginx', 'GCP', 'Certbot'],
        },
      ],
    },
    {
      category: 'Projects',
      items: [
        {
          id: 'portfolio-agent',
          title: 'Portfolio assistant',
          role: 'Personal project',
          period: 'Ongoing',
          brief:
            'I built a conversational assistant that answers questions about my background and the decisions behind each project, with an explicit notice that an agent is answering and can be wrong. I first assembled it with n8n and the OpenAI API, and on deploying it I rebuilt the orchestration in Python, because the Vercel free plan does not support n8n. I dropped litellm after measuring it — 133 MB of the 199 the dependencies took, against a 250 MB per-function limit — and talk to the model over plain REST with httpx.',
          /* No `url`: the assistant IS this page, so linking it from inside leads
             nowhere. It does appear on the CV, in the contact line. */
          tags: ['Python', 'FastAPI', 'DeepSeek', 'Vercel'],
        },
        {
          id: 'video-cli',
          title: 'Video clipping CLI',
          role: 'Personal project',
          period: 'Jul 2026 – ongoing',
          brief:
            'I built a TypeScript command-line tool that splits a long video into vertical clips: it transcribes with Whisper, writes the script with a model whose output is validated against a schema before use, narrates with speech synthesis and renders subtitles with Remotion. Every step persists its result to disk and the process is resumable, so already-paid model calls are never repeated.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
        },
        {
          id: 'portfolio-site',
          title: 'Portfolio',
          role: 'Personal project',
          period: '2026',
          brief:
            'I built this site with React and TypeScript, with variable type and animations written by hand, reinterpreting an existing design system and crediting it in the footer.',
          tags: ['React', 'TypeScript', 'Vite'],
          url: 'https://github.com/wilfred524/portfolio',
        },
      ],
    },
  ],
  social: [
    { label: 'GitHub', url: 'https://github.com/wilfred524' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/wilfred-morales-3220b2126' },
  ],
  ui: {
    nav: {
      experience: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
      ariaLabel: 'Main',
    },
    sections: {
      experience: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
      colophon: 'How this site is built',
    },
    blocks: { problem: 'Problem', hard: 'The hard part', result: 'Outcome' },
    viewCode: 'View the code',
    chat: {
      title: 'Ask what the page leaves out',
      intro: 'Why he made each decision, how he works, and what sits behind each project.',
      placeholder: 'Type your question',
      send: 'Send',
      thinking: 'Thinking',
      error: "I couldn't answer. Write to wilfred3019@gmail.com instead.",
      logLabel: 'Conversation with the agent',
      disclaimer: "You're talking to an agent, not to Wilfred. It can be wrong.",
      launcher: 'Ask the agent',
      closeLabel: 'Close the chat',
      invite: "Something the page doesn't cover? Ask me.",
      inviteDismiss: 'Dismiss',
    },
    credit: {
      intro: 'An interpretation of the design system',
      author: '“Henry” by Henry Desroches',
      catalogued: 'catalogued at',
      outro: 'Rebuilt in React; content and code my own.',
    },
  },
} satisfies Profile;
