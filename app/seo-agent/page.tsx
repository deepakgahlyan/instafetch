"use client";

import { useEffect, useMemo, useState } from "react";

const RAW_BASE = "https://raw.githubusercontent.com/deepakgahlyan/instafetch/develop/seo-agent/data/";

type Opportunity = {
  domain?: string;
  title?: string;
  url?: string;
  score?: number;
  qualityScore?: number;
  relevanceScore?: number;
  linkabilityScore?: number;
  editorialScore?: number;
  authorityScore?: number;
  spamRisk?: number;
  opportunityType?: string;
  type?: string;
  status?: string;
  action?: string;
  pitchAngle?: string;
  backlink?: { linked?: boolean; reachable?: boolean; httpStatus?: number };
};

type Outreach = { url?: string; domain?: string; to?: string | null; sent?: boolean; sendError?: string };
type Submission = { url?: string; domain?: string; status?: string; qualityScore?: number };

function normalize<T>(value: unknown, keys: string[]): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of keys) if (Array.isArray(obj[key])) return obj[key] as T[];
  }
  return [];
}

export default function SeoAgentDashboard() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [outreach, setOutreach] = useState<Outreach[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState("priority");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const stamp = Date.now();
      const [op, out, sub] = await Promise.all([
        fetch(`${RAW_BASE}opportunities.json?ts=${stamp}`).then((r) => { if (!r.ok) throw new Error(`opportunities HTTP ${r.status}`); return r.json(); }),
        fetch(`${RAW_BASE}outreach.json?ts=${stamp}`).then((r) => { if (!r.ok) throw new Error(`outreach HTTP ${r.status}`); return r.json(); }),
        fetch(`${RAW_BASE}submissions.json?ts=${stamp}`).then((r) => { if (!r.ok) throw new Error(`submissions HTTP ${r.status}`); return r.json(); }),
      ]);
      setItems(normalize<Opportunity>(op, ["opportunities", "items", "data", "results"]));
      setOutreach(normalize<Outreach>(out, ["outreach", "items", "data", "results"]));
      setSubmissions(normalize<Submission>(sub, ["submissions", "items", "data", "results"]));
    } catch (e) {
      setError(`Could not load the latest SEO data: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: items.length,
    priority: items.filter((x) => Number(x.qualityScore ?? x.score ?? 0) >= 80 && x.status === "qualified").length,
    drafts: outreach.length,
    ready: outreach.filter((x) => Boolean(x.to) && !x.sent).length,
    directories: submissions.filter((x) => x.status === "ready_for_review").length,
    needsAction: items.filter((x) => x.action === "manual-review" || x.action === "manual-directory-submission").length + submissions.filter((x) => x.status === "ready_for_review").length,
    confirmed: items.filter((x) => x.backlink?.linked).length,
  }), [items, outreach, submissions]);

  const filtered = useMemo(() => {
    const score = (x: Opportunity) => Number(x.qualityScore ?? x.score ?? 0);
    const sorted = [...items].sort((a, b) => score(b) - score(a));
    if (filter === "priority") return sorted.filter((x) => x.status === "qualified" && score(x) >= 80);
    if (filter === "outreach") return sorted.filter((x) => x.action === "draft-outreach");
    if (filter === "directories") return sorted.filter((x) => x.action === "manual-directory-submission");
    if (filter === "manual") return sorted.filter((x) => x.action === "manual-review" || x.action === "manual-directory-submission");
    if (filter === "confirmed") return sorted.filter((x) => x.backlink?.linked);
    return sorted;
  }, [items, filter]);

  const score = (x: Opportunity) => Number(x.qualityScore ?? x.score ?? 0);

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">InstaFetch</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">SEO Agent Dashboard</h1>
            <p className="mt-2 text-zinc-400">Quality-first backlink discovery, qualification, outreach and submission queue.</p>
          </div>
          <button onClick={load} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Refresh data</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {[
            ["Found", stats.total], ["Priority", stats.priority], ["Drafts", stats.drafts],
            ["Ready to email", stats.ready], ["Directories", stats.directories], ["Needs action", stats.needsAction], ["Backlinks confirmed", stats.confirmed],
          ].map(([label, value]) => (
            <button key={label} onClick={() => label === "Priority" ? setFilter("priority") : label === "Drafts" || label === "Ready to email" ? setFilter("outreach") : label === "Directories" ? setFilter("directories") : label === "Needs action" ? setFilter("manual") : label === "Backlinks confirmed" ? setFilter("confirmed") : setFilter("all")} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left hover:border-zinc-700">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {[["priority", "Priority"], ["outreach", "Outreach"], ["directories", "Directories"], ["manual", "Needs action"], ["confirmed", "Confirmed"], ["all", "All"]].map(([value, label]) => (
            <button key={value} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-sm ${filter === value ? "border-violet-400 bg-violet-500/15 text-violet-200" : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"}`}>{label}</button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold">{filter === "priority" ? "Priority Opportunities" : filter === "outreach" ? "Outreach Queue" : filter === "directories" ? "Directory Queue" : filter === "manual" ? "Needs Action" : filter === "confirmed" ? "Confirmed Backlinks" : "All Opportunities"}</h2>
            <p className="mt-1 text-sm text-zinc-500">Scored using relevance, linkability, editorial quality, authority and spam risk.</p>
          </div>
          {loading ? <div className="p-8 text-zinc-400">Loading latest opportunities…</div> : error ? <div className="p-8 text-red-400">{error}</div> : filtered.length === 0 ? <div className="p-8 text-zinc-400">Nothing in this queue yet.</div> : (
            <div className="divide-y divide-zinc-800">
              {filtered.map((x, i) => {
                const s = score(x);
                const type = x.opportunityType || x.type || "Opportunity";
                const manual = x.action === "manual-review" || x.action === "manual-directory-submission";
                const linked = Boolean(x.backlink?.linked);
                return (
                  <div key={`${x.url}-${i}`} className="p-5 hover:bg-zinc-900">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs font-semibold">{s}/100</span>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs">{type}</span>
                          {manual && <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">Needs you</span>}
                          {linked && <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Backlink confirmed</span>}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold">{x.title || x.domain || "Unnamed opportunity"}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{x.domain || x.url || ""}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                          <span>Relevance {x.relevanceScore ?? "—"}</span>
                          <span>Linkability {x.linkabilityScore ?? "—"}</span>
                          <span>Editorial {x.editorialScore ?? "—"}</span>
                          <span>Spam risk {x.spamRisk ?? "—"}</span>
                        </div>
                        {x.pitchAngle && <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">{x.pitchAngle}</p>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {x.url && <a href={x.url} target="_blank" rel="noreferrer" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">View site</a>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-500">
          The agent discovers and prepares opportunities, but does not bypass CAPTCHAs, create accounts, pay for listings, post spam, or automatically submit editorial changes. Email sending remains separately controlled by the workflow configuration.
        </div>
      </div>
    </main>
  );
}
