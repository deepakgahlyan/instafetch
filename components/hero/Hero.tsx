export default function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-6 text-5xl font-extrabold">
        Download Instagram
        <span className="text-pink-600"> Reels</span>,
        <span className="text-pink-600"> Videos</span> &
        <span className="text-pink-600"> Photos</span>
      </h1>

      <p className="mb-10 max-w-2xl text-lg text-gray-600">
        Fast, secure and free Instagram downloader. Paste your Instagram link
        below and download content in seconds.
      </p>

      <div className="flex w-full max-w-3xl flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Paste Instagram URL..."
          className="h-14 flex-1 rounded-xl border border-gray-300 px-5 outline-none focus:border-pink-600"
        />

        <button className="h-14 rounded-xl bg-pink-600 px-8 font-semibold text-white transition hover:bg-pink-700">
          Download
        </button>
      </div>

      <div className="mt-10 flex gap-8 text-gray-500">
        <span>⚡ Fast</span>
        <span>🔒 Secure</span>
        <span>💯 Free</span>
      </div>
    </section>
  );
}