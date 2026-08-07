export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-2xl font-bold">
          Insta<span className="text-pink-600">Fetch</span>
        </h1>

        <nav className="hidden gap-8 md:flex">
          <a href="#" className="hover:text-pink-600">
            Home
          </a>

          <a href="#" className="hover:text-pink-600">
            Features
          </a>

          <a href="#" className="hover:text-pink-600">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}