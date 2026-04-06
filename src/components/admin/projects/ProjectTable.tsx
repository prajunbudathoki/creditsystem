import { getProjects } from "@/actions/admin.actions";
import { ProjectActions } from "./ProjectActions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, ExternalLink } from "lucide-react";

export default async function ProjectTable({
  query,
  category,
  page,
}: {
  query?: string;
  category?: string;
  page?: string;
}) {
  const { projects, totalPages } = await getProjects(
    query,
    category,
    parseInt(page || "1"),
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground">
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Project
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Owner
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Category
              </th>
              <th className="text-center px-6 py-4 font-medium uppercase tracking-wider">
                Stats
              </th>
              <th className="text-center px-6 py-4 font-medium uppercase tracking-wider">
                Flags
              </th>
              <th className="text-right px-6 py-4 font-medium uppercase tracking-wider">
                Submitted
              </th>
              <th className="w-10 px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No projects found matching your criteria.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="group hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-secondary overflow-hidden border border-border shrink-0">
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-violet-500/10 text-violet-500 text-[10px] font-bold">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate max-w-[200px]">
                          {project.title}
                        </p>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-2 h-2" />
                          Live Site
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {project.user.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {project.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="font-mono text-[9px] uppercase tracking-tighter"
                    >
                      {project.category.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" /> {project.viewCount}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />{" "}
                        {project._count.feedbacks}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {project.isFeatured && (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] uppercase tracking-tighter h-5">
                          Featured
                        </Badge>
                      )}
                      {project.isHidden && (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] uppercase tracking-tighter h-5">
                          Hidden
                        </Badge>
                      )}
                      {!project.isFeatured && !project.isHidden && (
                        <span className="text-[10px] text-muted-foreground italic">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground italic">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ProjectActions project={project} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
