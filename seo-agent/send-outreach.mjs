import fs from "node:fs/promises";

const DATA_DIR = "seo-agent/data";
const OUTREACH_PATH = `${DATA_DIR}/outreach.json`;
const CONTACTS_PATH = `${DATA_DIR}/contacts.json`;
const OPPORTUNITIES_PATH = `${DATA_DIR}/opportunities.json`;
const TAVILY_API_URL = "https://api.tavily.com/search";
const MAX_CONTACT_LOOKUPS = 12;
const MAX_SENDS = Number(process.env.OUTREACH_DAILY_LIMIT || 3);
const FROM = process.env.OUTREACH_FROM || "hello@instafetch.app";
const REPLY_TO = process.env.OUTREACH_REPLY_TO || FROM;

async function readJson(path, fallback) { try { return JSON.parse(await fs.readFile(path, "utf8")); } catch { return fallback; } }
async function writeJson(path, value) { await fs.mkdir(DATA_DIR, { recursive: true }); await fs.writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8"); }
function extractEmails(text) {
  const found = String(text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  return [...new Set(found.map((x) => x.toLowerCase()))].filter((x) => !/example\.(com|org|net)$/.test(x));
}
async function tavily(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  const r = await fetch(TAVILY_API_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ api_key: key, query, topic: "general", search_depth: "basic", max_results: 5, include_answer: false, include_raw_content: false }) });
  if (!r.ok) return [];
  const data = await r.json();
  return Array.isArray(data.results) ? data.results : [];
}
async function findPublicContact(domain) {
  const existing = await readJson(CONTACTS_PATH, []);
  const old = existing.find((x) => x.domain === domain);
  if (old?.email) return old;
  const candidates = [];
  for (const path of ["/contact", "/contact-us", "/about", "/about-us", "/editorial"]) {
    try {
      const r = await fetch(`https://${domain}${path}`, { redirect: "follow", headers: { "user-agent": "InstaFetch-SEO-Agent/1.0" }, signal: AbortSignal.timeout(7000) });
      if (r.ok) candidates.push(...extractEmails(await r.text()));
    } catch {}
  }
  if (!candidates.length) {
    for (const result of await tavily(`${domain} contact editor email`)) candidates.push(...extractEmails(`${result.title || ""} ${result.content || ""}`));
  }
  const email = [...new Set(candidates)].find((x) => x.endsWith(`@${domain}`) || x.includes(domain)) || null;
  const record = { domain, email, checkedAt: new Date().toISOString(), source: email ? "public-site-or-search" : null };
  await writeJson(CONTACTS_PATH, [...existing.filter((x) => x.domain !== domain), record].slice(-500));
  return record;
}
async function sendEmail(to, subject, body) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const postal = process.env.OUTREACH_POSTAL_ADDRESS;
  if (!token || !accountId) throw new Error("Cloudflare sending is not configured");
  if (!postal) throw new Error("OUTREACH_POSTAL_ADDRESS is required before commercial outreach is enabled");
  const compliance = `${body}\n\nInstaFetch\n${postal}\n\nIf you do not want to receive future messages from InstaFetch, reply with “unsubscribe” and we will not contact you again.`;
  const html = compliance.split("\n\n").map((p) => `<p>${p.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`).join("");
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ to, from: FROM, reply_to: REPLY_TO, subject, text: compliance, html }) });
  const data = await r.json();
  if (!r.ok || !data.success) throw new Error(JSON.stringify(data.errors || data));
  return data.result || {};
}

async function main() {
  if (String(process.env.SEO_AGENT_SEND_EMAILS).toLowerCase() !== "true") {
    console.log("Outreach sending is disabled. Drafts and contact discovery remain enabled.");
    return;
  }
  const opportunities = await readJson(OPPORTUNITIES_PATH, []);
  const outreach = await readJson(OUTREACH_PATH, []);
  const byUrl = new Map(outreach.map((x) => [x.url, x]));
  const targets = opportunities.filter((x) => x.status === "qualified" && x.opportunityType !== "directory-submission").slice(0, MAX_CONTACT_LOOKUPS);

  for (const item of targets) {
    const draft = byUrl.get(item.url);
    if (!draft || draft.sent || draft.to) continue;
    const contact = await findPublicContact(item.domain);
    if (contact.email) {
      draft.to = contact.email;
      draft.contactSource = contact.source;
      draft.contactCheckedAt = contact.checkedAt;
      byUrl.set(item.url, draft);
    }
  }

  let sent = 0;
  for (const draft of [...byUrl.values()].filter((x) => x.to && !x.sent).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))) {
    if (sent >= MAX_SENDS) break;
    try {
      const result = await sendEmail(draft.to, draft.subject, draft.body);
      draft.sent = true;
      draft.sentAt = new Date().toISOString();
      draft.delivery = result;
      delete draft.sendError;
      sent++;
      console.log(`Sent personalized outreach to ${draft.to} (${draft.domain})`);
    } catch (error) {
      draft.sendError = error instanceof Error ? error.message : "unknown error";
      console.error(`Skipped ${draft.to}: ${draft.sendError}`);
    }
  }

  await writeJson(OUTREACH_PATH, [...byUrl.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 500));
  console.log(`Emails sent this run: ${sent}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
