import StepCard from "./StepCard";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 py-32"
    >
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold text-white">
          How It Works
        </h2>

        <p className="mt-4 text-zinc-400">
          Download any public Instagram content in three simple steps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <StepCard
          number="1"
          title="Copy Link"
          description="Copy the Instagram post or reel URL."
        />

        <StepCard
          number="2"
          title="Paste URL"
          description="Paste the link into the download box."
        />

        <StepCard
          number="3"
          title="Download"
          description="Download your content instantly."
        />
      </div>
    </section>
  );
}