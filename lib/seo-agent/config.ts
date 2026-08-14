export const SEO_AGENT_CONFIG = {
  site: {
    name: "InstaFetch",
    url: "https://www.instafetch.app",
    topics: [
      "Instagram downloader",
      "Instagram Reels downloader",
      "Instagram video downloader",
      "Instagram photo downloader",
      "Instagram creator tools",
      "social media tools",
    ],
  },
  quality: {
    minimumScore: 70,
    minimumRelevance: 65,
    minimumTrafficSignal: 40,
    maxSpamRisk: 25,
  },
  discovery: {
    maxCandidatesPerRun: 25,
    queries: [
      "Instagram downloader tools",
      "Instagram Reels downloader tools",
      "best Instagram tools for creators",
      "social media tools Instagram",
      "Instagram creator resources",
      "Instagram marketing tools",
    ],
  },
} as const;

export type SeoAgentConfig = typeof SEO_AGENT_CONFIG;
