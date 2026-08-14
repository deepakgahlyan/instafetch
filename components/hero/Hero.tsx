import HeroInput from "./HeroInput";
import HeroFeatures from "./HeroFeatures";
import HeroPlatforms from "./HeroPlatforms";

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-start overflow-hidden px-4 pb-10 pt-6 text-center sm:px-6 sm:pt-10 md:min-h-[90vh] md:justify-center md:pt-0">
      {/* Background glow */}
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl sm:h-96 sm:w-96 md:top-40" />

      {/* Badge */}
      <span className="relative mb-4 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-400 sm:mb-6 sm:px-5 sm:py-2 sm:text-sm">
        ⚡ Fast • Secure • Free Instagram Downloader
      </span>

      {/* Main heading */}
      <h1 className="relative max-w-5xl text-[2.7rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl sm:leading-tight md:text-7xl lg:text-8xl">
        Instagram Video{" "}
        <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
          Reels &amp; Photos Downloader
        </span>
      </h1>

      {/* Downloader immediately after heading */}
      <div className="relative mt-6 w-full max-w-4xl sm:mt-8 md:mt-10">
        <HeroInput />
      </div>

      {/* Description */}
      <p className="relative mt-5 max-w-3xl text-sm leading-6 text-zinc-400 sm:mt-7 sm:text-lg sm:leading-8 md:mt-8 md:text-xl">
        InstaFetch is a free online Instagram downloader for supported public
        Instagram videos, Reels, and photos. Paste an Instagram URL to check
        available media and download it directly from your browser.
      </p>

      {/* Secondary reassurance */}
      <p className="relative mt-2 max-w-2xl text-xs leading-5 text-zinc-500 sm:mt-3 sm:text-sm sm:leading-6">
        No Instagram login required. No software installation required.
      </p>

      {/* Features */}
      <div className="relative mt-5 sm:mt-7">
        <HeroFeatures />
      </div>

      {/* Platforms */}
      <div className="relative mt-4 sm:mt-6">
        <HeroPlatforms />
      </div>
    </section>
  );
}