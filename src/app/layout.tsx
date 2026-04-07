import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { RootClientWrapper } from "@/components/layout/RootClientWrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BuildLoop — Feedback Exchange for Indie Makers",
    template: "%s | BuildLoop",
  },
  description:
    "Give feedback, earn credits, submit your project, get real feedback from indie makers and builders. BuildLoop is the community-powered feedback platform for your apps, websites, and digital products.",
  keywords: [
    "feedback",
    "indie makers",
    "portfolio review",
    "app feedback",
    "build in public",
  ],
  openGraph: {
    title: "BuildLoop — Feedback Exchange for Indie Makers",
    description:
      "Give feedback, earn credits, get real feedback on your product.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RootClientWrapper session={session}>{children}</RootClientWrapper>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
