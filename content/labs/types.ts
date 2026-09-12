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
  media?: {
    type: "terminal";
    source: string;
    transcript: string;
  };
};

export type LabTroubleshooting = {
  title: string;
  command: string;
  detail: string;
};

export type LabPrerequisite = {
  label: string;
  value: string;
  detail: string;
  href?: string;
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
  decisionGuide?: {
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
  outcomes?: string[];
  duration: string;
  durationMinutes: number;
  steps: LabStep[];
  verification: string[];
  troubleshooting: LabTroubleshooting[];
  cleanup?: {
    explanation: string;
    command: string;
  };
};

export type Lab = {
  schemaVersion: 2;
  hodId: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  duration: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  topic: string;
  platform: string;
  status: "Available" | "Coming soon";
  hodNumber: number;
  publishedOrder: number;
  tags: string[];
  outcomes: string[];
  overview?: LabOverview;
  prerequisites: LabPrerequisite[];
  accessCallout?: {
    title: string;
    detail: string;
    links: Array<{
      href: string;
      label: string;
    }>;
  };
  comparisons?: LabComparison[];
  verified: {
    date: string;
    dateISO: string;
    os: string;
    architecture: string;
    package: string;
  };
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
  verifiedDate: string;
  verifiedDateISO: string;
};
