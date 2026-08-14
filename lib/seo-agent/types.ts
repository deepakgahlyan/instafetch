export type BacklinkOpportunity = {
  url: string;
  domain: string;
  title?: string;
  snippet?: string;
  sourceQuery?: string;
  relevanceScore: number;
  qualityScore: number;
  spamRisk: number;
  trafficSignal: number;
  editorialSignal: number;
  status: "discovered" | "qualified" | "rejected";
  discoveredAt: string;
};

export type SearchCandidate = {
  url: string;
  title?: string;
  snippet?: string;
};
