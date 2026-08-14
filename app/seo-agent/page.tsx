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
  spamScore?: number;
  type?: string;
  status?: string;
  action?: string;
  contactEmail?: string;
  reason?: string;
  notes?: string;
};

function normalize(value: unknown): Opportunity[] {
  if (Array.isArray(value)) return value as Opportunity[];
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["opportunities", "items", "data", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as Opportunity[];
    }
  }
  return [];
}

export default function SeoAgentDashboard() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${RAW_BASE}opportunities.json?ts=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setItems(normalize(data)))
      .catch((e) => setError(`Could not load the latest SEO data: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const score = (x: Opportunity) => Number(x.score ?? x.qualityScore ?? 0);
    return {
      total: items.length,
      high: items.filter((x) => score(x) >= 80).length,
      outreach: items.filter((x) => /email|outreach|editorial/i.test(`${x.type} ${x.action}`)).length,
      directory: items.filter((x) => /directory|resource|listing|submission/i.test(`${x.type} ${x.action}`)).length,
      manual: items.filter((x) => /manual|captcha|account|payment/i.test(`${x.status} ${x.action} ${x.notes}`)).length,
      confirmed: items.filter((x) => /confirmed|acquired|live/i.test(`${x.status}`)).length,
    };
  }, [items]);

  const score = (x: Opportunity) => Number(x.score ?? x.qualityScore ?? 0);
  const sorted = [...items].sort((a, b) => score(b) - score(a));

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">InstaFetch</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">SEO Agent Dashboard</h1>
            <p className="mt-2 text-zinc-400">Quality-first backlink opportunities, outreach and submission queue.</p>
          </div>
          <button onClick={() => window.location.reload()} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Refresh data</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["Opportunities", stats.total], ["High quality", stats.high], ["Outreach", stats.outreach],
            ["Directories", stats.directory], ["Needs action", stats.manual], ["Backlinks confirmed", stats.confirmed],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="font-semibold">Action Queue</h2>
            <p className="mt-1 text-sm text-zinc-500">Highest-quality opportunities appear first. Manual items are clearly flagged.</p>
          </div>
          {loading ? <div className="p-8 text-zinc-400">Loading latest opportunities…</div> : error ? <div className="p-8 text-red-400">{error}</div> : sorted.length === 0 ? <div className="p-8 text-zinc-400">No opportunities have been saved yet.</div> : (
            <div className="divide-y divide-zinc-800">
              {sorted.map((x, i) => {
                const s = score(x);
                const manual = /manual|captcha|account|payment/i.test(`${x.status} ${x.action} ${x.notes}`);
                return (
                  <div key={`${x.url}-${i}`} className="p-5 hover:bg-zinc-900">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs font-semibold">{s}/100</span>
                          <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs">{x.type || "Opportunity"}</span>
                          {manual && <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300">Needs you</span>}
                        </div>
                        <h3 className="mt-3 truncate text-lg font-semibold">{x.title || x.domain || "Unnamed opportunity"}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{x.domain || x.url || ""}</p>
                        {(x.reason || x.notes) && <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">{x.reason || x.notes}</p>}
                        {x.contactEmail && <p className="mt-2 text-sm text-violet-300">Contact: {x.contactEmail}</p>}
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
          The dashboard is read-only. It never bypasses CAPTCHAs, account creation, payment, or editorial approval. Those opportunities are surfaced for you to complete manually.
        </div>
      </div>
    </main>
  );
}
