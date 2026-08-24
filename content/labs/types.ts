export type LabStep = {
  label: string;
  title: string;
  image: string;
  alt: string;
  command?: string;
  explanation: string;
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
  items: Array<{
    title: string;
    detail: string;
  }>;
  note?: string;
};

export type LabComparison = {
  title: string;
  introduction: string;
  columns: [string, string];
  rows: Array<{
    aspect: string;
    values: [string, string];
  }>;
  takeaway: string;
  sources: Array<{
    label: string;
    href: string;
  }>;
};

export type Lab = {
  schemaVersion: 1;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  duration: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topic: string;
  platform: string;
  status: "Available" | "Coming soon";
  publishedOrder: number;
  tags: string[];
  outcomes: string[];
  overview?: LabOverview;
  prerequisites: LabPrerequisite[];
  comparisons?: LabComparison[];
  verified: {
    date: string;
    dateISO: string;
    os: string;
    architecture: string;
    package: string;
  };
  steps: LabStep[];
  troubleshooting: LabTroubleshooting[];
  completion: string[];
  cleanup: {
    explanation: string;
    command: string;
  };
};

export type LabSummary = Pick<Lab,
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
  | "publishedOrder"
  | "tags"
  | "outcomes"
> & {
  stepCount: number;
  verifiedDate: string;
  verifiedDateISO: string;
};
