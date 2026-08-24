import type { Profile } from './types';

/* `facts` se lee por POSICIÓN desde tools/cv/src/build.ts, no por etiqueta: reordenar
   este array cambia lo que sale impreso en el CV. */
export const en = {
  name: 'Wilfred Morales',
  role: 'Backend developer',
  stack: 'PHP/Laravel · PostgreSQL · Python',
  credential:
    'Configurable business logic, external service integrations and batch processing, shipped to production.',
  availability: 'Available immediately · Looking for my next role as a backend developer',
  trajectory: 'Remote · Colombia (GMT-5)',
  heroSlogan: { start: 'Ideas', link: 'into', end: 'Product' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  repoUrl: 'https://github.com/wilfred524/portfolio',
  siteUrl: 'https://portfolio-wilfred524.vercel.app',
  cv: { label: 'Download CV', url: '/Wilfred-Morales-Backend-Developer.pdf' },
  colophon:
    'React and TypeScript, no animation library: the particle field is 2D canvas and samples the typography of the document itself to form each heading. A single profile file feeds the page, the PDF CV and what the assistant knows. The assistant itself runs on Python in serverless functions. The code is public.',
  facts: [
    {
      id: 'education',
      label: 'Education',
      value: 'Computer Engineering, Universidad Nacional Experimental del Táchira (UNET).',
    },
    {
      id: 'languages',
      label: 'Languages and certifications',
      value:
        'Spanish (native) · English B2 (EF SET) · Google IT Automation with Python — Coursera (in progress)',
    },
    {
      id: 'mode',
      label: 'Work mode',
      value:
        'Remote · GMT-5 · Local employment in Colombia or international contracting via Deel.',
    },
    {
      id: 'domain',
      label: 'Domain',
      value:
        'Payroll-deduction lending: loans repaid through automatic salary deductions, a regulated sector in Colombia (Law 1527).',
    },
  ],
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP',
        'Laravel',
        'Eloquent ORM',
        'REST APIs',
        'Python',
        'Node.js',
        'Layered architecture (domain, application, persistence)',
        'Testing (PHPUnit)',
      ],
    },
    {
      area: 'Databases',
      items: [
        'PostgreSQL',
        'SQL',
        'MySQL',
        'Data modelling and migrations',
        'Query and index optimisation',
      ],
    },
    {
      area: 'Security and access control',
      items: [
        'Roles and permissions (Spatie)',
        'MFA and session management',
        'SAST and secret detection (Snyk, gitleaks)',
        'reCAPTCHA Enterprise',
      ],
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
      items: ['Docker', 'Linux', 'Nginx', 'GCP', 'AWS S3', 'Certbot'],
    },
    {
      area: 'Process',
      items: ['Git', 'GitHub Actions', 'CI/CD', 'Agile methodologies'],
    },
  ],
  employments: [
    {
      id: 'gaf',
      employer: 'GAF Technology Solutions',
      tagline:
        'Payroll-deduction lending fintech. Technology team of 4: 2 developers, a tech lead, and an infrastructure and security lead. Applications are originated by CK Comercializadora, a company in the same group.',
      role: 'Backend developer',
      period: 'Oct 2025 – Jul 2026',
      mode: 'Fixed-term project contract · Remote, Colombia',
    },
  ],
  projectGroups: [
    {
      category: 'GAF platform',
      employmentId: 'gaf',
      items: [
        {
          id: 'rules-engine',
          title: 'Credit rules engine',
          summary:
            'Credit policy lives as data in PostgreSQL, not as code: the business team adjusts a term limit without waiting for a deployment.',
          body: {
            problem:
              'Changing a credit policy meant a deployment: the business team could not adjust a term limit or a garnishment condition without going through development.',
            hard:
              'I modelled the data and translated business policy into a rules schema in PostgreSQL (eligibility, garnishments, term limits, employment and financial requirements per paying entity), so the code does not know what the rules are, only how to apply them. On top of that I implemented the full evaluation: borrowing-capacity calculation under Law 1527 (payroll-deduction lending) and Law 50 for active employees and pensioners, decision criteria, special rules, application re-evaluation, and the front-end and back-end validation.',
            result:
              'The business team adjusts parameters without touching code or waiting for a deployment, and every application is traced back to the advisor who filed it. A colleague built the submission REST API; I restructured its request body several times as the model changed.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          id: 'esignature',
          title: 'Electronic signature with identity validation',
          summary:
            'A 24-page document that used to be filled in by hand, now generated from templates and signed once the customer identity checks out.',
          metrics: [
            { value: '24', label: 'pages previously by hand' },
            { value: '20 min', label: 'full procedure' },
          ],
          body: {
            problem:
              'The previous module was disused and the document — 24 pages — was filled in by hand. I built the module from scratch: it is now generated automatically from templates, with a different template per product.',
            hard:
              'The hard part is not signing, it is getting everything to line up before signing. An advisor approves a draft, customer data is validated against TransUnion, and identity is verified by OTP or KBA. I designed the flow as a state machine over the asynchronous responses from the provider REST API, so a long process always ends in a valid document, or in an error the user can act on.',
            result:
              'The provider returns the signed document with its hash, the transaction is fully traceable, and a copy is kept in S3. The whole procedure closes in about 20 minutes, against a manual fill-in of 24 pages.',
          },
          tags: ['Laravel', 'Vue.js', 'Python', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
          title: 'Monthly credit scoring process',
          summary:
            'A container on a monthly cron pulls the data from PostgreSQL, runs the risk model and loads the results with no manual step.',
          metrics: [
            { value: '320,000+', label: 'people per run' },
            { value: '5,000', label: 'rows per batch' },
          ],
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
          id: 'query-optimization',
          title: 'Query optimisation in production',
          summary:
            'A query that took 20 to 30 seconds and ended in timeouts, fixed with upfront filters, indexes and pagination.',
          metrics: [
            { value: '3-6 s', label: 'previously 20-30 s' },
            { value: '0', label: 'timeouts' },
          ],
          body: {
            problem:
              'A query joining several tables took between 20 and 30 seconds to return, and timed out under high volume: the screen that depended on it was unusable exactly when there were most records to show.',
            hard:
              'I did not rewrite the whole query: I separated the three causes and went after each one. I applied filters upfront so the join would not start from the full set, added indexes on the fields taking part in the joins and the filters, and paginated the response so the page stopped loading everything at once.',
            result:
              'Response times dropped to between 3 and 6 seconds depending on the size of the result, and the timeouts were gone.',
          },
          tags: ['PostgreSQL', 'SQL', 'Laravel', 'Eloquent ORM'],
        },
        {
          id: 'access-control',
          title: 'Access control and permissions',
          summary:
            'A permission tree across 17 modules, down to the option and sub-process level, with existing users and roles migrated without stopping operations.',
          metrics: [{ value: '17', label: 'modules covered' }],
          brief:
            'I built the platform permission tree across 17 modules, with permissions down to the option and sub-process level, locked down every route, and migrated existing users and roles to the new schema without interrupting operations.',
          tags: ['Spatie Permission', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'layered-migration',
          title: 'Migration to a layered architecture',
          summary:
            'First stage of migrating six years of code, module by module, until controllers held no raw SQL at all.',
          metrics: [
            { value: '6 years', label: 'of legacy code' },
            { value: '3 months', label: 'of work' },
          ],
          brief:
            'I took part in the first stage of migrating the platform — six years of code — to a layered architecture, verifying every change module by module before moving on and removing raw SQL queries from controllers entirely. Three months of work, reviewed by the tech lead at each step.',
          tags: ['Layered architecture', 'Laravel', 'PostgreSQL'],
        },
        {
          id: 'infrastructure',
          title: 'Infrastructure and deployment',
          summary:
            'The application went from running natively to a container on a new GCP instance, with nginx in front and a parallel migration, with no downtime.',
          body: {
            problem:
              'The application ran natively on the machine, with no isolation between environment and code.',
            hard:
              'I containerised the application with Docker and deployed it on a new GCP instance, with nginx as a reverse proxy between the containers and the host.',
            result:
              'I ran the migration in parallel: I brought up and validated the new instance while the old one was still in production, configured the domain DNS and issued the certificates with Certbot until the application ran entirely over HTTPS. No service interruption.',
          },
          tags: ['Docker', 'Linux', 'Nginx', 'GCP', 'Certbot'],
        },
      ],
    },
    {
      category: 'Projects',
      items: [
        {
          id: 'video-cli',
          title: 'Video clipping CLI',
          role: 'Personal project',
          period: 'Jul 2026 – ongoing',
          summary:
            'Splits a long video into vertical clips: transcribes, writes the script, narrates and renders the subtitles, step by step and resumable.',
          brief:
            'I built a TypeScript command-line tool that splits a long video into vertical clips: it transcribes with Whisper, writes the script with a model whose output is validated against a schema before use, narrates with speech synthesis and renders subtitles with Remotion. Every step persists its result to disk and the process is resumable, so already-paid model calls are never repeated.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
        },
        {
          id: 'portfolio-site',
          title: 'Portfolio',
          role: 'Personal project',
          period: '2026',
          summary:
            'This site and its backend: one screen with no scroll, its headings formed by a particle field, and a Python agent that answers about my background.',
          metrics: [{ value: '133 MB', label: 'of dependency dropped' }],
          brief:
            'I built this site with React and TypeScript: a single screen with no scroll, walked plane by plane, with a 2D canvas particle field that samples the typography of the document itself and forms the headings with it, no animation library. The bilingual content comes out of a single profile file that also feeds the PDF CV. Behind it runs a conversational agent in Python on serverless functions, answering about my background and the decisions behind each project: it only knows what is in its knowledge base, versioned text files, and it states that an agent is answering and can be wrong. I first assembled it with n8n and the OpenAI API, and on deploying it I rebuilt the orchestration in Python, because the Vercel free plan does not support n8n. I dropped litellm after measuring it (133 MB of the 199 the dependencies took, against a 250 MB per-function limit) and talk to the model over plain REST with httpx.',
          tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'Vercel'],
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
    sections: {
      experience: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
      colophon: 'How this site is built',
      profile: 'Profile',
    },
    planes: {
      ariaLabel: 'Views',
      previous: 'Previous view',
      next: 'Next view',
      threshold: 'Start',
      context: 'Context',
      data: 'Data and decisions',
      platform: 'The platform',
      own: 'Own projects',
      stack: 'Stack',
      contact: 'Contact',
      enter: 'Begin',
      skipToWork: 'Skip to the work',
      documentMode: 'Document view',
      observatoryMode: 'Observatory view',
    },
    blocks: { problem: 'Problem', hard: 'The hard part', result: 'Outcome' },
    project: {
      open: 'View detail',
      close: 'Close',
      metrics: 'Numbers',
      stack: 'Stack',
      visit: 'View the repository',
    },
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
  },
} satisfies Profile;
