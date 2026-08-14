import fs from "node:fs/promises";

const SITE = "https://www.instafetch.app";
const API_URL = "https://api.tavily.com/search";
const MAX_RESULTS_PER_QUERY = 6;
const MAX_STORED = 500;
const MAX_OUTREACH_CANDIDATES = 12;
const DATA_DIR = "seo-agent/data";
const OPPORTUNITIES_PATH = `${DATA_DIR}/opportunities.json`;
const OUTREACH_PATH = `${DATA_DIR}/outreach.json`;
const LEARNING_PATH = `${DATA_DIR}/learnings.json`;
const SUBMISSIONS_PATH = `${DATA_DIR}/submissions.json`;
const CONTACTS_PATH = `${DATA_DIR}/contacts.json`;

const QUERIES = [
  "Instagram downloader tools", "Instagram Reels downloader tools",
  "best Instagram tools for creators", "Instagram creator resources",
  "Instagram marketing tools", "social media tools Instagram",
  "Instagram downloader comparison", "how to download Instagram Reels",
  "Instagram tools resource page", "Instagram creator blog tools",
  "Instagram tools directory submit", "social media tools directory add tool",
];

const SPAM_WORDS = ["casino", "betting", "poker", "pharma", "payday", "adult", "escort", "porn", "crypto loan", "link farm", "buy backlinks", "seo backlinks", "cheap backlinks", "guest post marketplace"];
const RELEVANCE_WORDS = ["instagram", "reels", "social media", "creator", "downloader", "video", "photo", "marketing", "tools", "resources", "content creator"];
const CONTACT_PATHS = ["/contact", "/contact-us", "/about", "/about-us", "/editorial", "/write-for-us"];
const BLOCKED_DOMAINS = [
  "instagram.com", "creators.instagram.com", "facebook.com", "creators.facebook.com",
  "facebookblueprint.com", "chromewebstore.google.com", "play.google.com",
  "youtube.com", "reddit.com", "github.com",
];
const LOW_VALUE_EMAIL_PREFIXES = ["privacy", "legal", "abuse", "security", "support", "noreply", "no-reply", "donotreply", "do-not-reply"];

const OPPORTUNITY_PATTERNS = [
  { type: "directory-submission", re: /directory|submit|submission|add (your|a) (tool|site)|list your|software directory|app directory/i },
  { type: "resource-page", re: /resource|resources|toolkit|tools|list of tools|best .* tools|top .* tools/i },
  { type: "editorial-mention", re: /blog|guide|review|comparison|best|top|how to|article/i },
  { type: "creator-resource", re: /creator|influencer|content marketing|social media/i },
  { type: "broken-link-candidate", re: /download|downloader|reels|instagram/i },
];

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
}

function rootDomain(domain) {
  const parts = String(domain).split(".").filter(Boolean);
  return parts.length >= 2 ? parts.slice(-2).join(".") : domain;
}

function isBlockedDomain(domain) {
  return BLOCKED_DOMAINS.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`));
}

async function readJson(path, fallback) {
  try { return JSON.parse(await fs.readFile(path, "utf8")); } catch { return fallback; }
}

async function writeJson(path, value) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function classifyOpportunity(item) {
  const text = `${item.title || ""} ${item.content || ""} ${item.url || ""}`;
  const match = OPPORTUNITY_PATTERNS.find((p) => p.re.test(text));
  const type = match?.type || "editorial-mention";
  const angles = {
    "directory-submission": "Submit InstaFetch only if the directory has a genuine editorial or curated listing process and the tool is relevant to its category.",
    "resource-page": "Offer InstaFetch as an additional free tool for readers who need to save supported public Instagram media.",
    "editorial-mention": "Offer InstaFetch as a relevant example where the article already discusses Instagram download workflows.",
    "creator-resource": "Offer InstaFetch as a practical resource for creators who need a simple way to save supported public Instagram media.",
    "broken-link-candidate": "Check whether the page contains an outdated or broken Instagram download reference that InstaFetch could legitimately replace.",
  };
  return { opportunityType: type, pitchAngle: angles[type], directoryCandidate: type === "directory-submission" };
}

function scoreCandidate(item) {
  const domain = domainOf(item.url);
  const text = `${item.title || ""} ${item.content || ""} ${item.url || ""}`.toLowerCase();
  const relevanceHits = RELEVANCE_WORDS.filter((word) => text.includes(word)).length;
  const relevanceScore = Math.min(100, 25 + relevanceHits * 8);
  const classified = classifyOpportunity(item);
  const type = classified.opportunityType;

  const pageSignals = [
    /list|top|best|tools|resources|comparison|review/.test(text),
    /blog|guide|article|marketing|creator/.test(text),
    /instagram|reels|downloader/.test(text),
  ].filter(Boolean).length;
  const linkabilityScore = type === "directory-submission"
    ? Math.min(100, 60 + pageSignals * 10)
    : type === "resource-page"
      ? Math.min(100, 65 + pageSignals * 8)
      : type === "editorial-mention"
        ? Math.min(100, 55 + pageSignals * 8)
        : type === "creator-resource"
          ? Math.min(100, 50 + pageSignals * 8)
          : Math.min(100, 40 + pageSignals * 8);

  const editorialScore = /blog|guide|review|resources|tools|comparison|how to|marketing|creator|news/.test(text) ? 85 : 55;
  const spamRisk = SPAM_WORDS.some((word) => text.includes(word)) ? 90 : 5;
  const authorityHint = /\.edu$|\.gov$|wikipedia|forbes|techcrunch|hubspot|buffer|hootsuite|wondershare|zapier|adobe/i.test(domain) ? 10 : 0;
  const authorityScore = Math.min(100, 55 + authorityHint);
  const blocked = isBlockedDomain(domain);
  const ownSite = rootDomain(domain) === "instafetch.app";

  const qualityScore = Math.max(0, Math.min(100, Math.round(
    relevanceScore * 0.30 +
    linkabilityScore * 0.35 +
    editorialScore * 0.15 +
    authorityScore * 0.15 +
    (100 - spamRisk) * 0.05
  )));

  const status = ownSite || blocked || spamRisk >= 25
    ? "rejected"
    : relevanceScore < 55 || linkabilityScore < 50 || qualityScore < 65
      ? "review"
      : "qualified";

  const action = status !== "qualified"
    ? "discard-or-review"
    : type === "directory-submission"
      ? "manual-directory-submission"
      : linkabilityScore >= 60
        ? "draft-outreach"
        : "manual-review";

  return {
    url: item.url,
    domain,
    title: item.title || "",
    snippet: item.content || "",
    relevanceScore,
    linkabilityScore,
    editorialScore,
    authorityScore,
    spamRisk,
    qualityScore,
    status,
    action,
    ...classified,
    discoveredAt: new Date().toISOString(),
  };
}

async function search(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error("TAVILY_API_KEY is not configured");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: key, query, topic: "general", search_depth: "basic", max_results: MAX_RESULTS_PER_QUERY, include_answer: false, include_raw_content: false }),
  });
  if (!response.ok) throw new Error(`Tavily returned ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function cleanTitle(title) {
  return String(title || "the article").replace(/\s+/g, " ").trim().slice(0, 140);
}

function createOutreachDraft(item, contactEmail = "") {
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
  return {
    to: contactEmail || null,
    subject: subjects[(seed >> 7) % subjects.length],
    body: `${greeting}\n\n${openings[seed % openings.length]}\n\n${middle[(seed >> 3) % middle.length]}\n\n${closings[(seed >> 5) % closings.length]}\n\nThanks,\nInstaFetch`,
    personalization: { targetDomain: item.domain, articleTitle: article, opportunityType: item.opportunityType, variationSeed: seed, generatedFromTarget: true },
    createdAt: new Date().toISOString(),
    sent: false,
  };
}

function extractEmails(text) {
  const found = String(text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return [...new Set(found.map((x) => x.toLowerCase()))].filter((email) => !/example\.(com|org|net)$/.test(email));
}

function isUsefulContact(email, domain) {
  if (!email || !email.includes("@")) return false;
  const lower = email.toLowerCase();
  if (!lower.endsWith(`@${domain}`)) return false;
  const local = lower.split("@")[0];
  return !LOW_VALUE_EMAIL_PREFIXES.some((prefix) => local === prefix || local.startsWith(`${prefix}.`) || local.startsWith(`${prefix}-`));
}

async function findContact(domain) {
  const existing = await readJson(CONTACTS_PATH, []);
  const previous = existing.find((x) => x.domain === domain);
  if (previous?.email && isUsefulContact(previous.email, domain)) return previous;

  const candidates = [];
  for (const path of CONTACT_PATHS.slice(0, 4)) {
    try {
      const response = await fetch(`https://${domain}${path}`, { redirect: "follow", headers: { "user-agent": "InstaFetch-SEO-Agent/1.0" }, signal: AbortSignal.timeout(7000) });
      if (response.ok) candidates.push(...extractEmails(await response.text()));
    } catch {}
  }
  if (!candidates.length) {
    try {
      for (const result of await search(`${domain} contact editor email`)) {
        candidates.push(...extractEmails(`${result.title || ""} ${result.content || ""} ${result.url || ""}`));
      }
    } catch {}
  }

  const email = [...new Set(candidates)].find((x) => isUsefulContact(x, domain)) || null;
  const record = { domain, email, checkedAt: new Date().toISOString(), source: email ? "public-site-or-search" : null };
  await writeJson(CONTACTS_PATH, [...existing.filter((x) => x.domain !== domain), record].slice(-500));
  return record;
}

function buildSubmission(item) {
  return {
    url: item.url,
    domain: item.domain,
    sourcePage: item.url,
    listingName: "InstaFetch",
    websiteUrl: SITE,
    description: "InstaFetch is a simple web-based tool for downloading supported public Instagram videos and Reels.",
    category: "Social Media Tools",
    tags: ["Instagram downloader", "Instagram Reels downloader", "social media tools", "video downloader"],
    opportunityType: item.opportunityType,
    qualityScore: item.qualityScore,
    status: "ready_for_review",
    automationNote: "Prepared for manual review. Do not submit where CAPTCHA, account creation, payment, or deceptive automation is required.",
    createdAt: new Date().toISOString(),
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

function buildLearningReport(opportunities, outreach, submissions) {
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
    generatedAt: new Date().toISOString(),
    totalOpportunities: opportunities.length,
    qualified: opportunities.filter((x) => x.status === "qualified").length,
    outreachDrafts: outreach.length,
    sent: outreach.filter((x) => x.sent).length,
    linked: opportunities.filter((x) => x.backlink?.linked).length,
    submissionQueue: submissions.filter((x) => x.status === "ready_for_review").length,
    byOpportunityType: groups,
    nextRunGuidance: Object.entries(groups).sort((a, b) => (b[1].linkRate - a[1].linkRate) || (b[1].avgQuality - a[1].avgQuality)).slice(0, 3).map(([type]) => type),
  };
}

async function main() {
  const existing = await readJson(OPPORTUNITIES_PATH, []);
  const existingOutreach = await readJson(OUTREACH_PATH, []);
  const existingSubmissions = await readJson(SUBMISSIONS_PATH, []);
  const byUrl = new Map(existing.map((item) => [item.url, item]));

  for (const query of QUERIES) {
    console.log(`Searching: ${query}`);
    for (const result of await search(query)) {
      if (!result.url) continue;
      const scored = scoreCandidate(result);
      const previous = byUrl.get(scored.url);
      byUrl.set(scored.url, {
        ...previous,
        ...scored,
        firstDiscoveredAt: previous?.firstDiscoveredAt || scored.discoveredAt,
        lastSeenAt: scored.discoveredAt,
        queries: [...new Set([...(previous?.queries || []), query])],
      });
    }
  }

  const all = [...byUrl.values()]
    .filter((x) => x.status !== "rejected")
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, MAX_STORED);

  for (const item of all) item.backlink = await verifyBacklink(item);

  const outreachByUrl = new Map(existingOutreach.map((x) => [x.url, x]));
  const submissionByUrl = new Map(existingSubmissions.map((x) => [x.url, x]));
  const outreachTargets = all.filter((x) => x.status === "qualified" && x.action === "draft-outreach" && !isBlockedDomain(x.domain)).slice(0, MAX_OUTREACH_CANDIDATES);

  for (const item of outreachTargets) {
    const existingDraft = outreachByUrl.get(item.url);
    if (!existingDraft) outreachByUrl.set(item.url, { url: item.url, domain: item.domain, ...createOutreachDraft(item) });
  }

  const directoryTargets = all.filter((x) => x.status === "qualified" && x.opportunityType === "directory-submission");
  for (const item of directoryTargets) {
    if (!submissionByUrl.has(item.url)) submissionByUrl.set(item.url, buildSubmission(item));
  }

  for (const draft of outreachByUrl.values()) {
    if (!draft.to && draft.domain && draft.url && all.some((x) => x.url === draft.url && x.action === "draft-outreach")) {
      const contact = await findContact(draft.domain);
      if (contact.email) {
        draft.to = contact.email;
        draft.contactSource = contact.source;
        draft.contactCheckedAt = contact.checkedAt;
      }
    }
  }

  const outreach = [...outreachByUrl.values()]
    .filter((x) => all.some((item) => item.url === x.url && item.status === "qualified" && item.action === "draft-outreach"))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 500);

  const submissions = [...submissionByUrl.values()]
    .sort((a, b) => Number(b.qualityScore || 0) - Number(a.qualityScore || 0))
    .slice(0, 500);

  await writeJson(OPPORTUNITIES_PATH, all);
  await writeJson(OUTREACH_PATH, outreach);
  await writeJson(SUBMISSIONS_PATH, submissions);
  await writeJson(LEARNING_PATH, buildLearningReport(all, outreach, submissions));

  console.log(`Stored opportunities: ${all.length}`);
  console.log(`Qualified opportunities: ${all.filter((x) => x.status === "qualified").length}`);
  console.log(`Outreach drafts: ${outreach.length}`);
  console.log(`Directory submissions ready for review: ${submissions.filter((x) => x.status === "ready_for_review").length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
