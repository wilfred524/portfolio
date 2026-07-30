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
  stack: 'PHP/Laravel · PostgreSQL · platform security',
  credential:
    'Electronic signature, credit rules engine and credit scoring, in production for payroll-deduction lending.',
  availability: 'Looking for my next role as a backend developer',
  trajectory: 'Backend development since October 2025 · Colombia (GMT-5)',
  /* Kept as a three-beat lockup with the nexus in italics, like the Spanish original.
     A literal "Ideas made Product" reads wrong in English. */
  heroSlogan: { start: 'Ideas', link: 'into', end: 'Product' },
  location: 'Colombia',
  email: 'wilfred3019@gmail.com',
  phone: '+57 301 737 4234',
  repoUrl: 'https://github.com/wilfred524/portfolio',
  cv: { label: 'Download CV', url: '/cv-en.pdf' },
  colophon:
    'This site is React and TypeScript, with variable type and animations written by hand. I chose that stack precisely because it was new ground: I already know I have the backend. I built it leaning on AI to write code — I define the architecture, give the instructions and verify every step — the same method I used to lead the migration to a layered architecture. The code is public.',
  closing:
    'What draws me in is always the same thing: a process someone does by hand and shouldn\'t, or a messy system that can be left better than I found it.',
  facts: [
    {
      label: 'Education',
      value:
        'Computer Engineering, Universidad Nacional Experimental del Táchira (UNET). Currently in 7th semester.',
    },
    {
      label: 'Languages',
      value: 'Spanish (native) · English B2, C2 reading',
    },
    {
      label: 'Availability',
      value:
        'Colombian documents — no visa or sponsorship required. Open to full-time roles in Colombia, remote or hybrid; also international contracting via Deel (GMT-5).',
    },
    {
      label: 'Domain',
      value:
        'Payroll-deduction lending: loans repaid through automatic salary deductions, a regulated sector in Colombia (Law 1527).',
    },
  ],
  skillGroups: [
    {
      area: 'Backend',
      items: [
        'PHP / Laravel',
        'PostgreSQL / SQL',
        'MySQL',
        'Hexagonal Architecture / DDD',
        'Testing (PHPUnit / pytest)',
        'Python',
        'Node.js',
      ],
    },
    {
      area: 'Security',
      items: [
        'Roles and permissions (Spatie)',
        'MFA / session management',
        'SAST and secret detection',
        'reCAPTCHA Enterprise',
      ],
    },
    {
      area: 'Automation & AI',
      items: ['n8n', 'OpenAI API', 'API / webhook integration'],
    },
    {
      area: 'Frontend',
      items: ['Vue.js', 'Inertia.js', 'Blade', 'Tailwind CSS', 'React', 'TypeScript'],
    },
    {
      area: 'Infrastructure',
      items: [
        'Docker',
        'Linux / Nginx',
        'CI/CD (GitHub Actions)',
        'Google Cloud Platform',
        'AWS S3',
      ],
    },
  ],
  projectGroups: [
    {
      category: 'In production',
      items: [
        {
          id: 'rules-engine',
          employer: 'gaf',
          title: 'Credit rules engine',
          company: 'CK Comercializadora, a GAF subsidiary',
          role: 'Backend developer',
          period: 'Oct 2025 – Present',
          body: {
            problem:
              'Changing a credit policy meant a deployment: the business team could not adjust a term limit or a garnishment condition without going through development.',
            hard:
              'I modelled the data and translated business policy into a rules schema in PostgreSQL —eligibility, garnishments, term limits, employment and financial requirements per payer— so the code does not know what the rules are, only how to apply them. On top of that I implemented the full evaluation: borrowing-capacity calculation under Law 1527 and Law 50 for active employees and pensioners, decision criteria, special rules, application re-evaluation, and the front-end and back-end validation.',
            result:
              'The business team adjusts parameters without touching code or waiting for a deployment, and every application is traced back to the advisor who filed it. A colleague built the submission API; I restructured its request body several times as the model changed.',
          },
          tags: ['Laravel', 'Vue.js', 'Inertia.js', 'PostgreSQL'],
        },
        {
          id: 'esignature',
          employer: 'gaf',
          title: 'Electronic signature with identity validation',
          company: 'GAF Technology Solutions',
          role: 'Backend developer',
          period: 'Oct 2025 – Present',
          body: {
            problem:
              'Signing documents while validating the signer\'s identity against a credit bureau: a form fills a template, the template travels to TransUnion, and a document comes back with a hash verifiable against the provider itself.',
            hard:
              'The hard part is not signing, it is surviving the third party. I implemented the state machine that follows the provider queue and restarts when it returns an unhandled state, preserving XML integrity across requests and translating its errors into something the user can act on.',
            result:
              'I delivered the payroll-lending module first —multi-step form with per-section autosave, PDF draft, email history and S3 upload retries— and then extracted the generic signing pattern, so the next module could implement it instead of repeating the flow. Small team, reviewed by the tech lead.',
          },
          tags: ['Laravel', 'Vue.js', 'TransUnion', 'AWS S3'],
        },
        {
          id: 'scoring',
          employer: 'gaf',
          title: 'Monthly credit scoring process',
          company: 'GAF Technology Solutions',
          role: 'Backend developer',
          period: 'Oct 2025 – Present',
          metric: '~300,000 records per run, once a month',
          body: {
            problem:
              'A risk model lived in a data analyst\'s notebook, with no way to reach production.',
            hard:
              'I packaged it into a container with a monthly cron: it reads from PostgreSQL, runs the model, checks the artifact has been regenerated before going further, and loads in batches of five thousand to bound each statement. It keeps state on disk so the same artifact is never processed twice, and discards invalid rows without aborting the whole load.',
            result:
              'The model is not mine; the plumbing that puts it in production is. I also added the live lookup: a service that asks the API for a customer\'s score and shows it on the underwriting screen.',
          },
          tags: ['Python', 'PostgreSQL', 'Docker', 'Laravel'],
        },
        {
          id: 'access-control',
          employer: 'gaf',
          title: 'Access control and auditing',
          company: 'GAF Technology Solutions',
          role: 'Backend developer',
          period: 'Oct 2025 – Present',
          brief:
            'I consolidated access control on Spatie —guards, middleware and policies— with a migration that moved existing users and roles to the new schema without interrupting anyone already working inside. I also worked on hardening authentication and on traceability of business-critical events, ahead of a security audit.',
          tags: ['Spatie Permission', 'Authentication', 'Auditing', 'Laravel'],
        },
        {
          id: 'layered-migration',
          employer: 'gaf',
          title: 'Migration to a layered architecture',
          company: 'GAF Technology Solutions',
          role: 'Backend developer',
          period: 'Oct 2025 – Present',
          brief:
            'I led and verified the migration of a six-year-old platform —over two hundred Eloquent models tangled with controllers, queues and providers— to a layered architecture. With no test suite to rely on, it went module by module instead of all at once. Three months, reviewed by the tech lead.',
          tags: ['Hexagonal Architecture', 'DDD', 'Laravel'],
        },
      ],
    },
    {
      category: 'Outside work',
      items: [
        {
          id: 'ai-automation',
          employer: 'self',
          title: 'AI process automation',
          company: 'Self-employed',
          role: 'Freelance, part-time',
          period: 'Jan 2026 – Present',
          brief:
            'Automation pipelines with n8n and the OpenAI API for content generation, and a conversational Telegram bot integrated with n8n and PostgreSQL that handles requests end to end.',
          tags: ['n8n', 'OpenAI API', 'PostgreSQL'],
        },
        {
          id: 'video-cli',
          title: 'Video clipping CLI',
          role: 'Personal project',
          period: 'Jul 2026 – ongoing',
          brief:
            'A TypeScript command-line tool that splits a long video into vertical clips: it transcribes with Whisper, writes the script with a model whose output is validated against a schema before use, narrates with speech synthesis and renders subtitles with Remotion. Every step persists its result to disk and the process is resumable, so already-paid model calls are never repeated.',
          tags: ['TypeScript', 'Node.js', 'Remotion', 'ffmpeg'],
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
    credit: {
      intro: 'An interpretation of the design system',
      author: '“Henry” by Henry Desroches',
      catalogued: 'catalogued at',
      outro: 'Rebuilt in React; content and code my own.',
    },
  },
} satisfies Profile;
