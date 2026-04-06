"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useState } from "react";
import { Session, authClient, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Zap,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Compass,
  Trophy,
  User,
  LogOut,
  PlusCircle,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar({
  session: initialSession,
}: {
  session: Session | null | undefined;
}) {
  const { data: sessionData } = authClient.useSession();
  const session = sessionData || initialSession;
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-3 glass rounded-2xl border border-white/10 px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Build<span className="text-primary">Loop</span>
            </span>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link
                  href="/projects/submit"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit
                </Link>
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-all overflow-hidden"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full gradient-primary rounded-xl flex items-center justify-center text-white text-sm font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary transition-all"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden mt-2 glass rounded-2xl border border-white/10 p-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <>
                <Link
                  href="/projects/submit"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                >
                  Submit Project
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 text-left transition-all"
                >
                  Sign Out
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
