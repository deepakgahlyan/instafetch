"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is InstaFetch free?",
    answer:
      "Yes. InstaFetch is designed to provide free downloads of supported public Instagram content.",
  },
  {
    question: "Do I need an Instagram account?",
    answer:
      "No. You do not need to log in to InstaFetch to use the downloader.",
  },
  {
    question: "What can I download?",
    answer:
      "InstaFetch is designed for supported public Instagram videos, reels and photos.",
  },
  {
    question: "Is my information stored?",
    answer:
      "InstaFetch does not require you to provide your Instagram login credentials.",
  },
  {
    question: "Why isn't my link working?",
    answer:
      "Make sure you copied a valid public Instagram URL. Private, unavailable, or unsupported content may not be downloadable.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-4xl px-6 py-32"
    >
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
          Questions?
        </span>

        <h2 className="text-5xl font-bold text-white">
          Frequently Asked Questions
        </h2>

        <p className="mt-4 text-zinc-400">
          Everything you need to know about InstaFetch.
        </p>
      </div>

      <div className="divide-y divide-zinc-800">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between py-7 text-left"
              >
                <span className="pr-8 text-lg font-semibold text-white">
                  {faq.question}
                </span>

                <span
                  className={`text-2xl text-zinc-500 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-7 pr-12 leading-7 text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}