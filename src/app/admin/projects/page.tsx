import { Suspense } from "react";
import ProjectTable from "@/components/admin/projects/ProjectTable";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = [
  "WEBSITE",
  "MOBILE_APP",
  "SAAS",
  "PORTFOLIO",
  "UI_DESIGN",
  "STARTUP_IDEA",
  "LANDING_PAGE",
  "OTHER",
];

export default async function ProjectManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
  const { query, category, page } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Project Moderation
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor and moderate submitted projects across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 border border-border rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title..."
            className="pl-9 h-10 bg-background"
            defaultValue={query}
          />
        </div>
        <select
          defaultValue={category}
          className="h-10 px-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full bg-secondary/20 animate-pulse rounded-2xl mt-6" />
        }
      >
        <ProjectTable query={query} category={category} page={page} />
      </Suspense>
    </div>
  );
}
