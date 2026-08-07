export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-10 text-center text-gray-500">
      © {new Date().getFullYear()} InstaFetch. All rights reserved.
    </footer>
  );
}