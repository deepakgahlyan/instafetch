import { Input } from "@/components/ui/input";

export default function HeroInput() {
  return (
    <div className="mt-10 w-full max-w-4xl">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 backdrop-blur-xl md:flex-row">
        <Input
          placeholder="Paste Instagram URL here..."
          className="h-16 flex-1 border-0 bg-transparent text-lg text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-500"
        />

        <button className="h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-10 text-lg font-semibold text-white transition duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]">
          Download
        </button>
      </div>
    </div>
  );
}