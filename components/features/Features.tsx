import { Download, Lock, Video } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-32"
    >
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
          Built for simplicity
        </span>

        <h2 className="text-5xl font-bold text-white">
          Why Choose InstaFetch?
        </h2>

        <p className="mt-4 text-zinc-400">
          Everything you need in one downloader.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Download size={34} />}
          title="Lightning Fast"
          description="Download supported Instagram content in seconds."
        />

        <FeatureCard
          icon={<Lock size={34} />}
          title="100% Secure"
          description="No Instagram login required and no credentials requested."
        />

        <FeatureCard
          icon={<Video size={34} />}
          title="HD Quality"
          description="Download supported content in the available original quality."
        />
      </div>
    </section>
  );
}