import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navigation } from "@/config/navigation";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Insta
          <span className="text-violet-500">Fetch</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <Button className="rounded-full">
          Download
        </Button>
      </div>
    </header>
  );
}