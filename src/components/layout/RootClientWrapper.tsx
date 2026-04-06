"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Session } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function RootClientWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null | undefined;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar session={session} />}
      <main className={cn("flex-1", !isAdmin && "pt-20")}>{children}</main>
    </>
  );
}
