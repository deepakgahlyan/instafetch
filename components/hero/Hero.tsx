import HeroInput from "./HeroInput";
import HeroFeatures from "./HeroFeatures";
import HeroPlatforms from "./HeroPlatforms";

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <span className="relative mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-400">
        ⚡ Fast • Secure • Free
      </span>

      <h1 className="relative max-w-5xl text-6xl font-extrabold leading-tight text-white md:text-8xl">
        Download Instagram{" "}
        <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
          Videos &amp; Reels
        </span>
      </h1>

      <p className="relative mt-8 max-w-2xl text-xl text-zinc-400">
        Download public Instagram videos, Reels and photos in seconds with
        InstaFetch. No Instagram login required.
      </p>

      <HeroInput />

      <HeroFeatures />

      <HeroPlatforms />
    </section>
  );
}