import fs from "node:fs/promises";

const SITE = "https://www.instafetch.app";
const API_URL = "https://api.tavily.com/search";
const MAX_RESULTS_PER_QUERY = 6;
const MAX_STORED = 500;
const MAX_OUTREACH_CANDIDATES = 12;
const MAX_EMAILS_PER_RUN = Number(process.env.OUTREACH_DAILY_LIMIT || 3);
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
const DIRECTORY_WORDS = ["directory", "submit", "submission", "add your tool", "add tool", "list your", "submit a tool", "resource list", "tool directory", "software directory", "app directory"];
const CONTACT_PATHS = ["/contact", "/contact-us", "/about", "/about-us", "/editorial", "/write-for-us"];
const OPPORTUNITY_PATTERNS = [
  { type: "directory-submission", re: /directory|submit|submission|add (your|a) (tool|site)|list your|software directory|app directory/i },
  { type: "resource-page", re: /resource|resources|toolkit|tools|list of tools/i },
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
  const ownSite = domain === "instafetch.app" || domain === "www.instafetch.app";
  const authorityHint = /\.edu$|\.gov$|wikipedia|forbes|techcrunch|hubspot|buffer|hootsuite|wondershare|zapier|adobe/i.test(domain) ? 10 : 0;
  const quality = Math.min(100, Math.round(relevance * 0.45 + editorial * 0.35 + (100 - spamRisk) * 0.15 + authorityHint));
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
  const text = `${item.title || ""} ${item.snippet || ""} ${item.url || ""}`;
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

function hashString(value) { let hash = 0; for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0; return Math.abs(hash); }
function cleanTitle(title) { return String(title || "the article").replace(/\s+/g, " ").trim().slice(0, 140); }

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

async function findContact(domain) {
  const existing = await readJson(CONTACTS_PATH, []);
  const previous = existing.find((x) => x.domain === domain);
  if (previous?.email) return previous;
  const candidates = [];
  for (const path of CONTACT_PATHS.slice(0, 4)) {
    try {
      const url = `https://${domain}${path}`;
      const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "InstaFetch-SEO-Agent/1.0" }, signal: AbortSignal.timeout(7000) });
      if (!response.ok) continue;
      const html = await response.text();
      candidates.push(...extractEmails(html));
    } catch {}
  }
  if (!candidates.length) {
    try {
      const results = await search(`${domain} contact editor email`);
      for (const result of results) candidates.push(...extractEmails(`${result.title || ""} ${result.content || ""} ${result.url || ""}`));
    } catch {}
  }
  const email = [...new Set(candidates)].find((x) => x.endsWith(`@${domain}`) || x.includes(domain));
  const record = { domain, email: email || null, checkedAt: new Date().toISOString(), source: email ? "public-site-or-search" : null };
  await writeJson(CONTACTS_PATH, [...existing.filter((x) => x.domain !== domain), record].slice(-500));
  return record;
}

function buildSubmission(item) {
  const description = "InstaFetch is a simple web-based tool for downloading supported public Instagram videos and Reels.";
  return {
    url: item.url,
    domain: item.domain,
    sourcePage: item.url,
    listingName: "InstaFetch",
    websiteUrl: SITE,
    description,
    category: "Social Media Tools",
    tags: ["Instagram downloader", "Instagram Reels downloader", "social media tools", "video downloader"],
    opportunityType: item.opportunityType,
    qualityScore: item.qualityScore,
    status: "ready_for_review",
    automationNote: "The agent may prepare this listing automatically. Actual third-party submission should only occur where the site explicitly permits it and does not require CAPTCHA, account creation, payment, or deceptive automation.",
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

async function sendEmail(to, subject, body, domain) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !accountId) throw new Error("Cloudflare sending is not configured");
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      from: process.env.OUTREACH_FROM || "hello@instafetch.app",
      reply_to: process.env.OUTREACH_REPLY_TO || "hello@instafetch.app",
      subject,
      text: body,
      html: body.split("\n\n").map((p) => `<p>${p.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`).join(""),
      headers: { "X-InstaFetch-SEO": "quality-outreach" },
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(`Cloudflare email failed: ${JSON.stringify(data.errors || data)}`);
  return data.result || {};
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
    generatedAt: new Date().toISOString(), totalOpportunities: opportunities.length,
    qualified: opportunities.filter((x) => x.status === "qualified").length,
    outreachDrafts: outreach.length, sent: outreach.filter((x) => x.sent).length,
    linked: opportunities.filter((x) => x.backlink?.linked).length,
    submissionQueue: submissions.filter((x) => x.status === "ready_for_review").length,
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
  const submissions = await readJson(SUBMISSIONS_PATH, []);
  const submissionByUrl = new Map(submissions.map((item) => [item.url, item]));

  for (const item of opportunities.filter((x) => x.status === "qualified").slice(0, 50)) {
    if (!item.opportunityType) Object.assign(item, identifyOpportunity(item));
    if (item.directoryCandidate) submissionByUrl.set(item.url, buildSubmission(item));
    if (!outreachByUrl.has(item.url) && item.opportunityType !== "directory-submission") outreachByUrl.set(item.url, { url: item.url, domain: item.domain, ...createOutreachDraft(item) });
    if (!item.backlink || Date.now() - new Date(item.backlink.checkedAt || 0).getTime() > 7 * 86400000) item.backlink = await verifyBacklink(item);
  }

  let sentThisRun = 0;
  const nextOutreach = [...outreachByUrl.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (String(process.env.SEO_AGENT_SEND_EMAILS).toLowerCase() === "true") {
    for (const draft of nextOutreach.filter((x) => !x.sent && x.to).slice(0, MAX_EMAILS_PER_RUN)) {
      if (sentThisRun >= MAX_EMAILS_PER_RUN) break;
      try {
        const result = await sendEmail(draft.to, draft.subject, draft.body, draft.domain);
        draft.sent = true;
        draft.sentAt = new Date().toISOString();
        draft.delivery = result;
        sentThisRun++;
        console.log(`Sent personalized outreach to ${draft.to} for ${draft.domain}`);
      } catch (error) {
        draft.sendError = error instanceof Error ? error.message : "unknown error";
        console.error(`Could not send to ${draft.to}: ${draft.sendError}`);
      }
    }
  }

  const contactTargets = opportunities.filter((x) => x.status === "qualified" && x.opportunityType !== "directory-submission" && !outreachByUrl.get(x.url)?.to).slice(0, MAX_OUTREACH_CANDIDATES);
  for (const item of contactTargets) {
    const contact = await findContact(item.domain);
    const draft = outreachByUrl.get(item.url) || { url: item.url, domain: item.domain, ...createOutreachDraft(item) };
    if (contact.email) draft.to = contact.email;
    outreachByUrl.set(item.url, draft);
  }

  const finalOutreach = [...outreachByUrl.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 500);
  const finalSubmissions = [...submissionByUrl.values()].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 500);
  const learning = buildLearningReport(opportunities, finalOutreach, finalSubmissions);
  await writeJson(OPPORTUNITIES_PATH, opportunities);
  await writeJson(OUTREACH_PATH, finalOutreach);
  await writeJson(SUBMISSIONS_PATH, finalSubmissions);
  await writeJson(LEARNING_PATH, learning);

  console.log(`Opportunities: ${opportunities.length}`);
  console.log(`Qualified: ${learning.qualified}`);
  console.log(`Outreach drafts: ${learning.outreachDrafts}`);
  console.log(`Emails sent this run: ${sentThisRun}`);
  console.log(`Directory submissions queued: ${learning.submissionQueue}`);
  console.log(`Verified backlinks: ${learning.linked}`);
  console.log(`Best opportunity types: ${learning.nextRunGuidance.join(", ") || "none yet"}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
