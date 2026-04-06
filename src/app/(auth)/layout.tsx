"use client";

import { Navbar } from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = authClient.useSession().data;
  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen flex items-center justify-center pt-20 px-4">
        {children}
      </main>
    </>
  );

}
