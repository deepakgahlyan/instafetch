import StepCard from "./StepCard";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 py-32"
    >
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
          Simple & Fast
        </span>

        <h2 className="text-5xl font-bold text-white">
          How It Works
        </h2>

        <p className="mt-4 text-zinc-400">
          Download public Instagram content in three simple steps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <StepCard
          number="1"
          title="Copy Link"
          description="Open Instagram and copy the link to the public post or reel you want to download."
        />

        <StepCard
          number="2"
          title="Paste URL"
          description="Paste the Instagram URL into the InstaFetch downloader above."
        />

        <StepCard
          number="3"
          title="Download"
          description="Click download and save your content to your device."
        />
      </div>
    </section>
  );
}