const features = [
  {
    title: "Instagram Video Downloader",
    description:
      "Download supported public Instagram videos by pasting the video's URL into InstaFetch. Available media can be previewed before downloading.",
  },
  {
    title: "Instagram Reels Downloader",
    description:
      "Save supported public Instagram Reels directly from your browser. Copy the Reel URL, paste it into InstaFetch, and download the available media.",
  },
  {
    title: "Instagram Photo Downloader",
    description:
      "Download supported public Instagram photos from a URL without installing additional software or signing in to Instagram.",
  },
  {
    title: "No Instagram Login",
    description:
      "InstaFetch does not require you to enter your Instagram username or password to use the downloader.",
  },
  {
    title: "Works in Your Browser",
    description:
      "Use InstaFetch on desktop, tablet, or mobile through a modern web browser. No dedicated application is required.",
  },
  {
    title: "Simple URL Workflow",
    description:
      "Copy a supported public Instagram URL, paste it into InstaFetch, check the available media, and download it.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative mx-auto max-w-7xl px-6 py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          InstaFetch Features
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          A simple Instagram downloader
        </h2>

        <p className="mt-5 text-lg leading-8 text-zinc-400">
          InstaFetch is a free online tool for downloading supported public
          Instagram videos, Reels, and photos directly from your browser.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-500/40"
          >
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}