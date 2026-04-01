import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-separator bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-indigo-400 transition-colors"
        >
          Seeing Bayes
        </Link>
        <div className="flex items-center gap-5">
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="/learn/bayes"
              className="text-text-secondary hover:text-indigo-400 transition-colors"
            >
              Learn
            </Link>
            <Link
              href="/explore/bayes"
              className="text-text-secondary hover:text-indigo-400 transition-colors"
            >
              Explore
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
