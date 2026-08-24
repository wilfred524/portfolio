
export interface Employment {
  id: string;
  employer: string;
  tagline?: string;
  role: string;
  period: string;
  mode?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  role?: string;
  period?: string;
  metrics?: { value: string; label: string }[];
  body?: {
    problem: string;
    hard: string;
    result: string;
  };
  brief?: string;
  tags: string[];
  url?: string;
}

export interface ProjectGroup {
  category: string;
  employmentId?: string;
  note?: string;
  items: ProjectItem[];
}

export interface Fact {
  id: 'education' | 'languages' | 'mode' | 'domain';
  label: string;
  value: string;
  href?: string;
  hrefLabel?: string;
}

export interface SkillGroup {
  area: string;
  items: string[];
}

export interface UiStrings {
  sections: {
    experience: string;
    skills: string;
    contact: string;
    colophon: string;
    profile: string;
  };
  blocks: { problem: string; hard: string; result: string };
  project: {
    open: string;
    close: string;
    metrics: string;
    stack: string;
    visit: string;
  };
  viewCode: string;
  planes: {
    ariaLabel: string;
    previous: string;
    next: string;
    threshold: string;
    context: string;
    data: string;
    platform: string;
    own: string;
    stack: string;
    contact: string;
    enter: string;
    skipToWork: string;
    documentMode: string;
    observatoryMode: string;
  };
  chat: {
    title: string;
    intro: string;
    placeholder: string;
    send: string;
    thinking: string;
    error: string;
    logLabel: string;
    disclaimer: string;
    launcher: string;
    closeLabel: string;
    invite: string;
    inviteDismiss: string;
  };
}

export interface Profile {
  name: string;
  role: string;
  stack: string;
  credential: string;
  availability: string;
  trajectory: string;
  heroSlogan: { start: string; link: string; end: string };
  location: string;
  email: string;
  phone: string;
  repoUrl: string;
  siteUrl: string;
  cv: { label: string; url: string };
  colophon: string;
  facts: Fact[];
  skillGroups: SkillGroup[];
  employments: Employment[];
  projectGroups: ProjectGroup[];
  social: { label: string; url: string }[];
  ui: UiStrings;
}
