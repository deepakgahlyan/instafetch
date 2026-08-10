"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/config/navigation";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-white"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-20 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                {item.title}
              </Link>
            ))}

            <Link
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Download
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}