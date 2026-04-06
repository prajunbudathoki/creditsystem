import { Suspense } from "react";
import FeedbackTable from "@/components/admin/feedback/FeedbackTable";
import { Search, ShieldAlert, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function FeedbackModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            Feedback Moderation
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor all feedback exchange activity and remove low-quality
            content.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search feedback by content, project, or reviewer..."
          className="pl-9 h-12 bg-card border-border shadow-sm focus:ring-primary/20"
          defaultValue={query}
        />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 w-full bg-secondary/20 animate-pulse rounded-2xl border border-border"
              />
            ))}
          </div>
        }
      >
        <FeedbackTable query={query} page={page} />
      </Suspense>
    </div>
  );
}
