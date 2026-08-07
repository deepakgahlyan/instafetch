import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-32"
    >
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold text-white">
          Why Choose InstaFetch?
        </h2>

        <p className="mt-4 text-zinc-400">
          Everything you need in one downloader.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon="⚡"
          title="Lightning Fast"
          description="Download Instagram videos in seconds."
        />

        <FeatureCard
          icon="🔒"
          title="100% Secure"
          description="No login required. No data stored."
        />

        <FeatureCard
          icon="🎥"
          title="HD Quality"
          description="Original quality downloads every time."
        />
      </div>
    </section>
  );
}