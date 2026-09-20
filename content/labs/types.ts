export type LabStep = {
  label: string;
  title: string;
  image: string;
  alt: string;
  explanation: string;
  commands: Array<{
    command: string;
    explanation: string;
  }>;
  expected: string;
  note?: string;
  troubleshooting: string;
  recovery?: Array<{
    symptom: string;
    detail: string;
    command?: string;
  }>;
  media?: {
    type: "terminal";
    source: string;
    transcript: string;
  };
};

export type LabPrerequisite = {
  label: string;
  value: string;
  detail: string;
  href?: string;
};

export type LabGuidanceCallout = {
  title: string;
  paragraphs: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
};

export type LabProof = {
  eyebrow?: string;
  title: string;
  introduction: string;
  items: Array<{
    title: string;
    detail: string;
  }>;
};

export type LabRecap = {
  title: string;
  introduction: string;
  items: Array<{
    title: string;
    detail: string;
  }>;
  selfCheck?: {
    title: string;
    introduction: string;
    questions: string[];
  };
};

export type LabSupportGuidance = {
  title: string;
  introduction: string;
  routes: Array<{
    title: string;
    detail: string;
    reference?: {
      label: string;
      href: string;
    };
  }>;
  diagnostics: {
    title: string;
    introduction: string;
    items: Array<{
      command: string;
      detail: string;
    }>;
  };
};

export type LabOverview = {
  title: string;
  introduction: string;
  itemsLabel?: string;
  items: Array<{
    title: string;
    detail: string;
  }>;
  note?: string;
  relatedTools?: Array<{
    title: string;
    detail: string;
    status: string;
    href?: string;
    linkLabel?: string;
    primary?: boolean;
    reference: {
      label: string;
      href: string;
    };
  }>;
  orchestrationOptions?: {
    title: string;
    introduction: string;
    items: Array<{
      title: string;
      category: string;
      detail: string;
      href?: string;
      linkLabel?: string;
      reference: {
        label: string;
        href: string;
      };
    }>;
    note: string;
  };
};

export type LabComparison = {
  title: string;
  introduction: string;
  afterDemoId?: string;
  eyebrow?: string;
  notesLabel?: string;
  notes?: Array<{
    title: string;
    detail: string;
    reference?: {
      label: string;
      href: string;
    };
  }>;
  cellLayout?: "text" | "stacked";
  summaryLabel?: string;
  rowHeader?: string;
  takeawayLabel?: string;
  columns: string[];
  rows: Array<{
    aspect: string;
    values: string[];
    reference?: {
      label: string;
      href: string;
    };
  }>;
  takeaway?: string;
  followups?: Array<{
    title: string;
    paragraphs?: string[];
    items?: Array<{
      title: string;
      detail: string;
    }>;
  }>;
  decisionGuide?: {
    label?: string;
    title: string;
    introduction: string;
    options: Array<{
      title: string;
      label: string;
      detail: string;
      bestFor: string;
      note?: string;
      reference?: {
        label: string;
        href: string;
      };
      href?: string;
      linkLabel?: string;
    }>;
    pathTitle: string;
    path: Array<{
      condition: string;
      result: string;
    }>;
  };
  sources: Array<{
    label: string;
    href: string;
  }>;
};

export type LabDemo = {
  id: string;
  demoId: string;
  title: string;
  objective: string;
  coverImage: string;
  coverAlt: string;
  outcomes: string[];
  duration: string;
  durationMinutes: number;
  validationBoundary: string;
  nextActions: string[];
  relatedHod?: {
    title: string;
    detail: string;
    href: string;
    linkLabel: string;
  };
  steps: LabStep[];
  verification: string[];
  completionRecord: {
    introduction: string;
    maintenancePath: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  };
  cleanup?: {
    explanation: string;
    command: string;
  };
};

export type LabTopic = "Ansible" | "RHEL";

export type Lab = {
  schemaVersion: 2;
  hodId: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  audience?: string;
  coverImage: string;
  coverAlt: string;
  socialImage?: string;
  socialImageWidth?: number;
  socialImageHeight?: number;
  duration: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  topic: LabTopic;
  platform: string;
  status: "Available" | "Coming soon";
  hodNumber: number;
  publishedOrder: number;
  tags: string[];
  outcomes: string[];
  overview?: LabOverview;
  proof?: LabProof;
  recap?: LabRecap;
  supportGuidance?: LabSupportGuidance;
  prerequisites: LabPrerequisite[];
  prerequisiteCallouts?: LabGuidanceCallout[];
  prerequisiteDetails?: {
    title: string;
    introduction: string;
    items: LabGuidanceCallout[];
  };
  comparisons?: LabComparison[];
  demos: LabDemo[];
};

export type LabSummary = Pick<Lab,
  | "hodId"
  | "slug"
  | "title"
  | "shortDescription"
  | "description"
  | "coverImage"
  | "coverAlt"
  | "duration"
  | "durationMinutes"
  | "difficulty"
  | "topic"
  | "platform"
  | "status"
  | "hodNumber"
  | "publishedOrder"
  | "tags"
  | "outcomes"
> & {
  stepCount: number;
  demoCount: number;
};
