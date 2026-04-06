"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  CreditCard,
  History,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Audit Log", href: "/admin/audit-log", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={cn(
        "hidden md:flex flex-col bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 ease-in-out z-50",
        isCollapsed && "items-center",
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border mb-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            B
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight">
              BuildLoop{" "}
              <span className="text-xs text-primary font-mono ml-1">ADMIN</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("w-5 h-5 shrink-0", isActive && "text-primary")}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-all"
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <ChevronRight className="w-5 h-5 shrink-0" />
          </motion.div>
          {!isCollapsed && (
            <span className="text-sm font-medium">Collapse Sidebar</span>
          )}
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Exit Admin</span>
          )}
        </Link>
      </div>
    </motion.aside>
  );
}
