const steps = [
  {
    number: "01",
    title: "Copy an Instagram URL",
    description:
      "Open a supported public Instagram video, Reel, or photo and copy its URL from Instagram.",
  },
  {
    number: "02",
    title: "Paste the URL into InstaFetch",
    description:
      "Paste the Instagram URL into the InstaFetch downloader on this page and start the download process.",
  },
  {
    number: "03",
    title: "Check available media",
    description:
      "InstaFetch checks the URL and displays available downloadable media when supported content can be accessed.",
  },
  {
    number: "04",
    title: "Download your media",
    description:
      "Preview the available media and select Download to save the supported video, Reel, or photo to your device.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          How InstaFetch Works
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Download supported Instagram media in a few steps
        </h2>

        <p className="mt-5 text-lg leading-8 text-zinc-400">
          InstaFetch uses a simple URL-based workflow for supported public
          Instagram videos, Reels, and photos.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <article
            key={step.number}
            className="relative rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 backdrop-blur-xl"
          >
            <span className="text-sm font-bold text-violet-400">
              {step.number}
            </span>

            <h3 className="mt-5 text-xl font-semibold text-white">
              {step.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              {step.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
        <p className="text-sm leading-7 text-zinc-400">
          InstaFetch does not require an Instagram password or dedicated
          application. Availability depends on whether the supplied Instagram
          URL contains supported public content that can be accessed.
        </p>
      </div>
    </section>
  );
}