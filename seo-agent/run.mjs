import fs from "node:fs/promises";

const SITE = "https://www.instafetch.app";
const API_URL = "https://api.tavily.com/search";
const MAX_RESULTS_PER_QUERY = 6;
const MAX_STORED = 500;
const DATA_DIR = "seo-agent/data";
const OPPORTUNITIES_PATH = `${DATA_DIR}/opportunities.json`;
const OUTREACH_PATH = `${DATA_DIR}/outreach.json`;
const LEARNING_PATH = `${DATA_DIR}/learnings.json`;

const QUERIES = [
  "Instagram downloader tools", "Instagram Reels downloader tools",
  "best Instagram tools for creators", "Instagram creator resources",
  "Instagram marketing tools", "social media tools Instagram",
  "Instagram downloader comparison", "how to download Instagram Reels",
  "Instagram tools resource page", "Instagram creator blog tools",
];
const SPAM_WORDS = ["casino", "betting", "poker", "pharma", "payday", "adult", "escort", "porn", "crypto loan", "link farm", "buy backlinks", "seo backlinks", "cheap backlinks", "guest post marketplace"];
const RELEVANCE_WORDS = ["instagram", "reels", "social media", "creator", "downloader", "video", "photo", "marketing", "tools", "resources", "content creator"];
const OPPORTUNITY_PATTERNS = [
  { type: "resource-page", re: /resource|resources|toolkit|tools|directory|list of tools/i },
  { type: "editorial-mention", re: /blog|guide|review|comparison|best|top|how to|article/i },
  { type: "creator-resource", re: /creator|influencer|content marketing|social media/i },
  { type: "broken-link-candidate", re: /download|downloader|reels|instagram/i },
];

function domainOf(url) { try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; } }
async function readJson(path, fallback) { try { return JSON.parse(await fs.readFile(path, "utf8")); } catch { return fallback; } }
async function writeJson(path, value) { await fs.mkdir(DATA_DIR, { recursive: true }); await fs.writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8"); }

function scoreCandidate(item) {
  const domain = domainOf(item.url);
  const text = `${item.title || ""} ${item.content || ""} ${item.url || ""}`.toLowerCase();
  const relevanceHits = RELEVANCE_WORDS.filter((word) => text.includes(word)).length;
  const relevance = Math.min(100, 30 + relevanceHits * 8);
  const editorial = /blog|guide|review|resources|tools|comparison|how to|marketing|creator|news/.test(text) ? 85 : 55;
  const spamRisk = SPAM_WORDS.some((word) => text.includes(word)) ? 90 : 5;
  const ownSite = domain === "instafetch.app";
  const quality = Math.round(relevance * 0.5 + editorial * 0.35 + (100 - spamRisk) * 0.15);
  return { url: item.url, domain, title: item.title || "", snippet: item.content || "", relevanceScore: relevance, editorialScore: editorial, spamRisk, qualityScore: quality, status: !ownSite && spamRisk < 25 && relevance >= 55 && quality >= 65 ? "qualified" : "rejected", discoveredAt: new Date().toISOString() };
}

async function search(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("TAVILY_API_KEY is not configured");
  const response = await fetch(API_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ api_key: key, query, topic: "general", search_depth: "basic", max_results: MAX_RESULTS_PER_QUERY, include_answer: false, include_raw_content: false }) });
  if (!response.ok) throw new Error(`Tavily returned ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

function identifyOpportunity(item) {
  const text = `${item.title} ${item.snippet} ${item.url}`;
  const match = OPPORTUNITY_PATTERNS.find((p) => p.re.test(text));
  const angles = {
    "resource-page": "Offer InstaFetch as an additional free tool for readers who need to save supported public Instagram media.",
    "editorial-mention": "Offer InstaFetch as a relevant example where the article already discusses Instagram download workflows.",
    "creator-resource": "Offer InstaFetch as a practical resource for creators who need a simple way to save supported public Instagram media.",
    "broken-link-candidate": "Check whether the page contains an outdated or broken Instagram download reference that InstaFetch could legitimately replace.",
  };
  const type = match?.type || "editorial-mention";
  return { opportunityType: type, pitchAngle: angles[type] };
}

// Create varied, target-specific outreach drafts. Variation is based on the actual article,
// opportunity type, and target domain; it is not a single mass-mail template.
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function cleanTitle(title) {
  return String(title || "the article").replace(/\s+/g, " ").trim().slice(0, 140);
}

function createOutreachDraft(item) {
  const article = cleanTitle(item.title);
  const angle = item.pitchAngle || "InstaFetch may be relevant to readers looking for a simple Instagram resource.";
  const seed = hashString(`${item.domain}:${article}:${item.opportunityType}`);
  const openings = [
    `I was reading “${article}” and thought one small addition might be useful.`,
    `I came across “${article}” while looking through Instagram resources and noticed the section on related tools.`,
    `I found “${article}” while researching Instagram tools and wanted to pass along a resource that may fit the page.`,
    `Your “${article}” caught my attention because it already covers tools in this space.`,
    `I was looking at your Instagram resources and came across “${article}”.`,
  ];
  const middle = [
    `${angle} InstaFetch is a simple browser-based option for supported public Instagram media: ${SITE}.`,
    `InstaFetch is another browser-based option for supported public Instagram media, and it may be worth considering if you update the list: ${SITE}.`,
    `The reason I’m reaching out is that InstaFetch could give readers another simple option alongside the tools you already mention: ${SITE}.`,
    `If you are revisiting the article, InstaFetch could be a relevant addition for readers looking for a straightforward web-based option: ${SITE}.`,
  ];
  const closings = [
    `If it doesn't fit the article, no worries at all.`,
    `Feel free to take a look and decide whether it adds anything useful for your readers.`,
    `No pressure if it isn't a match for the page.`,
    `I’ll leave it with you in case it is useful for a future update.`,
  ];
  const subjects = [
    `A possible addition to “${article.slice(0, 65)}”`,
    `One resource for your Instagram tools article`,
    `A small suggestion for your Instagram guide`,
    `Possible addition for your Instagram resource list`,
    `Resource suggestion for your Instagram article`,
  ];
  const greeting = seed % 4 === 0 ? "Hello," : seed % 4 === 1 ? "Hi there," : seed % 4 === 2 ? "Hi," : "Hello there,";
  const opening = openings[seed % openings.length];
  const bodyMiddle = middle[(seed >> 3) % middle.length];
  const closing = closings[(seed >> 5) % closings.length];
  const subject = subjects[(seed >> 7) % subjects.length];

  return {
    subject,
    body: `${greeting}\n\n${opening}\n\n${bodyMiddle}\n\n${closing}\n\nThanks,\nInstaFetch`,
    personalization: {
      targetDomain: item.domain,
      articleTitle: article,
      opportunityType: item.opportunityType,
      variationSeed: seed,
      generatedFromTarget: true,
    },
    createdAt: new Date().toISOString(),
    sent: false,
  };
}

async function verifyBacklink(item) {
  try {
    const response = await fetch(item.url, { redirect: "follow", headers: { "user-agent": "InstaFetch-SEO-Agent/1.0" }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { reachable: false, linked: false, httpStatus: response.status, checkedAt: new Date().toISOString() };
    const html = await response.text();
    const linked = html.toLowerCase().includes("instafetch.app");
    return { reachable: true, linked, httpStatus: response.status, checkedAt: new Date().toISOString() };
  } catch (error) {
    return { reachable: false, linked: false, error: error instanceof Error ? error.message : "unknown error", checkedAt: new Date().toISOString() };
  }
}

function buildLearningReport(opportunities, outreach) {
  const groups = {};
  for (const item of opportunities) {
    const type = item.opportunityType || "unknown";
    groups[type] ??= { opportunities: 0, linked: 0, avgQuality: 0 };
    groups[type].opportunities++;
    groups[type].linked += item.backlink?.linked ? 1 : 0;
    groups[type].avgQuality += item.qualityScore || 0;
  }
  for (const group of Object.values(groups)) {
    group.avgQuality = group.opportunities ? Math.round(group.avgQuality / group.opportunities) : 0;
    group.linkRate = group.opportunities ? Number((group.linked / group.opportunities).toFixed(3)) : 0;
  }
  return {
    generatedAt: new Date().toISOString(), totalOpportunities: opportunities.length,
    qualified: opportunities.filter((x) => x.status === "qualified").length,
    outreachDrafts: outreach.length, sent: outreach.filter((x) => x.sent).length,
    linked: opportunities.filter((x) => x.backlink?.linked).length,
    byOpportunityType: groups,
    nextRunGuidance: Object.entries(groups).sort((a, b) => (b[1].linkRate - a[1].linkRate) || (b[1].avgQuality - a[1].avgQuality)).slice(0, 3).map(([type]) => type),
  };
}

async function main() {
  const existing = await readJson(OPPORTUNITIES_PATH, []);
  const byUrl = new Map(existing.map((item) => [item.url, item]));

  for (const query of QUERIES) {
    console.log(`Searching: ${query}`);
    for (const result of await search(query)) {
      if (!result.url) continue;
      const scored = scoreCandidate(result);
      const previous = byUrl.get(scored.url);
      const merged = { ...(previous || {}), ...scored, firstDiscoveredAt: previous?.firstDiscoveredAt || scored.discoveredAt, lastSeenAt: scored.discoveredAt, queries: Array.from(new Set([...(previous?.queries || []), query])) };
      if (merged.status === "qualified") Object.assign(merged, identifyOpportunity(merged));
      byUrl.set(scored.url, merged);
    }
  }

  const opportunities = [...byUrl.values()].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, MAX_STORED);
  const outreach = await readJson(OUTREACH_PATH, []);
  const outreachByUrl = new Map(outreach.map((item) => [item.url, item]));

  for (const item of opportunities.filter((x) => x.status === "qualified").slice(0, 50)) {
    if (!item.opportunityType) Object.assign(item, identifyOpportunity(item));
    if (!outreachByUrl.has(item.url)) outreachByUrl.set(item.url, { url: item.url, domain: item.domain, ...createOutreachDraft(item) });
    if (!item.backlink || Date.now() - new Date(item.backlink.checkedAt || 0).getTime() > 7 * 86400000) item.backlink = await verifyBacklink(item);
  }

  const nextOutreach = [...outreachByUrl.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 500);
  const learning = buildLearningReport(opportunities, nextOutreach);
  await writeJson(OPPORTUNITIES_PATH, opportunities);
  await writeJson(OUTREACH_PATH, nextOutreach);
  await writeJson(LEARNING_PATH, learning);

  console.log(`Opportunities: ${opportunities.length}`);
  console.log(`Qualified: ${learning.qualified}`);
  console.log(`Outreach drafts: ${learning.outreachDrafts}`);
  console.log(`Verified backlinks: ${learning.linked}`);
  console.log(`Best opportunity types: ${learning.nextRunGuidance.join(", ") || "none yet"}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
