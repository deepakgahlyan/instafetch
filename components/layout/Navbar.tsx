import Link from "next/link";
import { navigation } from "@/config/navigation";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="relative z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          <span className="text-white">Insta</span>
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

        <div className="hidden md:block">
          <Link
            href="#download"
            className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Download
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}