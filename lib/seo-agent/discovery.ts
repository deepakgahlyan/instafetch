import { SEO_AGENT_CONFIG } from "./config";
import { scoreCandidate } from "./scoring";
import type { BacklinkOpportunity, SearchCandidate } from "./types";

/**
 * Provider-neutral discovery adapter.
 *
 * Set SEO_SEARCH_API_URL to an endpoint that accepts POST { query } and returns
 * { results: [{ url, title, snippet }] }. This keeps the agent independent of
 * any single search vendor and prevents credentials from entering the codebase.
 */
async function searchWeb(query: string): Promise<SearchCandidate[]> {
  const endpoint = process.env.SEO_SEARCH_API_URL;
  if (!endpoint) return [];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.SEO_SEARCH_API_KEY
        ? { authorization: `Bearer ${process.env.SEO_SEARCH_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({ query, limit: SEO_AGENT_CONFIG.discovery.maxCandidatesPerRun }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`SEO search provider returned ${response.status}`);
  }

  const data = (await response.json()) as { results?: SearchCandidate[] };
  return Array.isArray(data.results) ? data.results : [];
}

export async function discoverBacklinkOpportunities(): Promise<BacklinkOpportunity[]> {
  const candidates: BacklinkOpportunity[] = [];

  for (const query of SEO_AGENT_CONFIG.discovery.queries) {
    const results = await searchWeb(query);
    for (const result of results) {
      if (!result.url) continue;
      candidates.push(scoreCandidate(result, query));
    }
  }

  const unique = new Map<string, BacklinkOpportunity>();
  for (const opportunity of candidates) {
    const key = opportunity.domain || opportunity.url;
    const current = unique.get(key);
    if (!current || opportunity.qualityScore > current.qualityScore) {
      unique.set(key, opportunity);
    }
  }

  return [...unique.values()].sort((a, b) => b.qualityScore - a.qualityScore);
}
