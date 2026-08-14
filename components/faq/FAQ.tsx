const faqs = [
  {
    question: "What is InstaFetch?",
    answer:
      "InstaFetch is a free online Instagram downloader for supported public Instagram videos, Reels, and photos. It lets users check available media from a supported Instagram URL and download it directly from a web browser.",
  },
  {
    question: "How does InstaFetch work?",
    answer:
      "Copy the URL of a supported public Instagram video, Reel, or photo and paste it into the InstaFetch downloader. InstaFetch checks the URL and displays available media when downloadable content is found.",
  },
  {
    question: "Can I download Instagram Reels with InstaFetch?",
    answer:
      "Yes. InstaFetch supports downloading supported public Instagram Reels. Copy the Reel URL, paste it into InstaFetch, and download the available media.",
  },
  {
    question: "Can I download Instagram videos with InstaFetch?",
    answer:
      "Yes. InstaFetch supports downloading supported public Instagram videos. Paste the video's Instagram URL into the downloader to check whether downloadable media is available.",
  },
  {
    question: "Can I download Instagram photos with InstaFetch?",
    answer:
      "Yes. InstaFetch supports downloading supported public Instagram photos when downloadable media is available from the supplied URL.",
  },
  {
    question: "Do I need an Instagram login to use InstaFetch?",
    answer:
      "No. InstaFetch is designed to work without requiring users to enter their Instagram username or password.",
  },
  {
    question: "Do I need to install an app to use InstaFetch?",
    answer:
      "No. InstaFetch is a browser-based service. You can use it from a supported desktop, tablet, or mobile web browser without installing a dedicated application.",
  },
  {
    question: "Is InstaFetch free?",
    answer:
      "Yes. InstaFetch is free to use for supported public Instagram media.",
  },
  {
    question: "Does InstaFetch work on mobile devices?",
    answer:
      "Yes. InstaFetch is designed to work through modern mobile web browsers as well as desktop browsers.",
  },
  {
    question: "Why can't InstaFetch download some Instagram content?",
    answer:
      "Not every Instagram URL can be processed. Content may be private, unavailable, unsupported, restricted, or otherwise inaccessible. InstaFetch only provides downloadable media when it can successfully access supported content.",
  },
  {
    question: "Does InstaFetch store my Instagram password?",
    answer:
      "No. InstaFetch does not require you to provide an Instagram username or password to use the downloader.",
  },
  {
    question: "Is downloading Instagram content allowed?",
    answer:
      "Users should only download and use content they have permission to save or reuse. Copyright, privacy, and other applicable laws and platform terms can apply to downloaded content. InstaFetch does not grant permission to reuse someone else's content.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative mx-auto max-w-5xl px-6 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          InstaFetch FAQ
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Frequently asked questions
        </h2>

        <p className="mt-5 text-lg leading-8 text-zinc-400">
          Learn how InstaFetch works, what Instagram content it supports, and
          what you need to use the downloader.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold text-white">
              <div className="flex items-center justify-between gap-6">
                <span>{faq.question}</span>

                <span className="shrink-0 text-2xl text-violet-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </div>
            </summary>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}