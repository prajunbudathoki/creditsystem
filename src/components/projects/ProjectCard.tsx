"use client";

import { MessageSquare, Heart, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import { PROJECT_CATEGORIES } from "@/lib/utils";

export function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    liveUrl: string;
    tags: string[];
    thumbnailUrl?: string | null;
    createdAt: Date;
    user: { name: string; username?: string | null; image?: string | null };
    _count: { feedbacks: number; votes: number };
  };
}) {
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.value === project.category)?.label ??
    project.category;

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 h-full relative">
      {/* Thumbnail */}
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center opacity-40">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex-shrink-0 z-20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden">
              {project.user.image ? (
                <img
                  src={project.user.image}
                  alt={project.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {project.user.name[0]}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {project.user.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {project._count.feedbacks}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {project._count.votes}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-10"
        title={`View ${project.title}`}
      />
    </div>
  );
}
