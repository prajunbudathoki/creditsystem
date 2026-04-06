import { Suspense } from "react";
import { getProjects } from "@/actions/project.actions";
import { timeAgo, PROJECT_CATEGORIES } from "@/lib/utils";
import {
  Compass,
  ExternalLink,
  MessageSquare,
  Heart,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Explore Projects" };

import { ProjectCard } from "@/components/projects/ProjectCard";

async function ProjectGrid({ filter }: { filter: string }) {
  const projects = await getProjects(
    filter as "new" | "trending" | "featured" | "most-reviewed",
  );
  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold mb-1">No projects yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Be the first to submit!
        </p>
        <Link
          href="/projects/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:opacity-90 transition-all"
        >
          Submit a Project
        </Link>
      </div>
    );
  }
  return (
    <>
      {projects.map((project) => (
        <div key={project.id} className="relative">
          <ProjectCard project={project} />
        </div>
      ))}
    </>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter ?? "new";

  const tabs = [
    { id: "new", label: "New", icon: Zap },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "most-reviewed", label: "Most Reviewed", icon: MessageSquare },
    { id: "featured", label: "Featured", icon: Star },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Explore Projects</h1>
        <p className="text-muted-foreground">
          Discover builds from indie makers. Give feedback, earn credits.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/explore?filter=${tab.id}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        <Suspense
          fallback={
            <div className="col-span-full text-center py-16 text-muted-foreground">
              Loading projects...
            </div>
          }
        >
          <ProjectGrid filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
