import TernLogo from "./TernLogo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <TernLogo size={22} className="text-accent" />
          Grow Tern
        </Link>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
          <Link href="#" className="hover:text-foreground">Help center</Link>
        </div>
        <p className="text-muted">2026 Grow Tern</p>
      </div>
    </footer>
  );
}
