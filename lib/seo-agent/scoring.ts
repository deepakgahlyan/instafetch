import { SEO_AGENT_CONFIG } from "./config";
import type { BacklinkOpportunity, SearchCandidate } from "./types";

const LOW_VALUE_HOST_PATTERNS = [
  /(^|\.)pinterest\./i,
  /(^|\.)facebook\./i,
  /(^|\.)instagram\./i,
  /(^|\.)youtube\./i,
];

const SPAM_PATTERNS = [
  /casino/i,
  /betting/i,
  /poker/i,
  /pharma/i,
  /crypto.*loan/i,
  /payday/i,
  /link.*farm/i,
];

function domainFromUrl(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function textScore(candidate: SearchCandidate): number {
  const text = `${candidate.title ?? ""} ${candidate.snippet ?? ""}`.toLowerCase();
  const matches = SEO_AGENT_CONFIG.site.topics.filter((topic) =>
    text.includes(topic.toLowerCase()),
  ).length;
  return Math.min(100, 35 + matches * 13);
}

export function scoreCandidate(
  candidate: SearchCandidate,
  sourceQuery?: string,
): BacklinkOpportunity {
  const domain = domainFromUrl(candidate.url);
  const text = `${candidate.title ?? ""} ${candidate.snippet ?? ""} ${domain}`;
  const relevanceScore = textScore(candidate);
  const spamRisk = SPAM_PATTERNS.some((pattern) => pattern.test(text))
    ? 90
    : LOW_VALUE_HOST_PATTERNS.some((pattern) => pattern.test(domain))
      ? 45
      : 10;

  const editorialSignal = /blog|guide|review|tools|resources|marketing|creator/i.test(text)
    ? 85
    : 55;
  const trafficSignal = domain ? 55 : 0;
  const qualityScore = Math.round(
    relevanceScore * 0.4 +
      editorialSignal * 0.3 +
      trafficSignal * 0.2 +
      (100 - spamRisk) * 0.1,
  );

  const qualified =
    qualityScore >= SEO_AGENT_CONFIG.quality.minimumScore &&
    relevanceScore >= SEO_AGENT_CONFIG.quality.minimumRelevance &&
    trafficSignal >= SEO_AGENT_CONFIG.quality.minimumTrafficSignal &&
    spamRisk <= SEO_AGENT_CONFIG.quality.maxSpamRisk;

  return {
    url: candidate.url,
    domain,
    title: candidate.title,
    snippet: candidate.snippet,
    sourceQuery,
    relevanceScore,
    qualityScore,
    spamRisk,
    trafficSignal,
    editorialSignal,
    status: qualified ? "qualified" : "rejected",
    discoveredAt: new Date().toISOString(),
  };
}
