// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-black bg-opacity-80 text-white py-4 px-6 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <Link href="/">YourOrder</Link>
        </h1>
        <nav className="space-x-4">
          <Link href="/question-flow" className="hover:underline">
            ごはんを探す
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
