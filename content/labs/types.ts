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
  prerequisites: LabPrerequisite[];
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
