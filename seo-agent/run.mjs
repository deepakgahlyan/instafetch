const SITE = "https://www.instafetch.app";
const API_URL = "https://api.tavily.com/search";
const MAX_RESULTS_PER_QUERY = 6;
const MAX_STORED = 500;

const QUERIES = [
  'Instagram downloader tools',
  'Instagram Reels downloader tools',
  'best Instagram tools for creators',
  'Instagram creator resources',
  'Instagram marketing tools',
  'social media tools Instagram',
  'Instagram downloader comparison',
  'how to download Instagram Reels',
];

const SPAM_WORDS = [
  "casino", "betting", "poker", "pharma", "payday", "adult", "escort",
  "porn", "crypto loan", "link farm", "buy backlinks", "seo backlinks",
];

const RELEVANCE_WORDS = [
  "instagram", "reels", "social media", "creator", "downloader", "video",
  "photo", "marketing", "tools", "resources",
];

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function scoreCandidate(item) {
  const domain = domainOf(item.url);
  const text = `${item.title || ""} ${item.content || ""} ${item.url || ""}`.toLowerCase();
  const relevanceHits = RELEVANCE_WORDS.filter((word) => text.includes(word)).length;
  const relevance = Math.min(100, 30 + relevanceHits * 8);
  const editorial = /blog|guide|review|resources|tools|comparison|how to|marketing|creator|news/.test(text) ? 85 : 55;
  const spamRisk = SPAM_WORDS.some((word) => text.includes(word)) ? 90 : 5;
  const ownSite = domain === "instafetch.app";
  const quality = Math.round(relevance * 0.5 + editorial * 0.35 + (100 - spamRisk) * 0.15);

  let status = "rejected";
  if (!ownSite && spamRisk < 25 && relevance >= 55 && quality >= 65) status = "qualified";

  return {
    url: item.url,
    domain,
    title: item.title || "",
    snippet: item.content || "",
    relevanceScore: relevance,
    editorialScore: editorial,
    spamRisk,
    qualityScore: quality,
    status,
    discoveredAt: new Date().toISOString(),
  };
}

async function search(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("TAVILY_API_KEY is not configured");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query,
      topic: "general",
      search_depth: "basic",
      max_results: MAX_RESULTS_PER_QUERY,
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily returned ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

async function main() {
  const existingPath = "seo-agent/data/opportunities.json";
  const existing = JSON.parse(await Bun.file(existingPath).text().catch(() => "[]"));
  const byUrl = new Map(existing.map((item) => [item.url, item]));

  for (const query of QUERIES) {
    console.log(`Searching: ${query}`);
    const results = await search(query);
    for (const result of results) {
      if (!result.url) continue;
      const scored = scoreCandidate(result);
      const previous = byUrl.get(scored.url);
      byUrl.set(scored.url, {
        ...(previous || {}),
        ...scored,
        firstDiscoveredAt: previous?.firstDiscoveredAt || scored.discoveredAt,
        lastSeenAt: scored.discoveredAt,
        queries: Array.from(new Set([...(previous?.queries || []), query])),
      });
    }
  }

  const opportunities = [...byUrl.values()]
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, MAX_STORED);

  await Bun.write(existingPath, JSON.stringify(opportunities, null, 2) + "\n");

  const qualified = opportunities.filter((item) => item.status === "qualified");
  console.log(`Stored ${opportunities.length} opportunities; ${qualified.length} currently qualified.`);
  console.log("Top qualified opportunities:");
  for (const item of qualified.slice(0, 10)) {
    console.log(`- ${item.qualityScore}/100 ${item.domain} ${item.url}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
