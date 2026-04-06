import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/profile.actions";
import { getUserProjects } from "@/actions/project.actions";
import { timeAgo, PROJECT_CATEGORIES } from "@/lib/utils";
import Link from "next/link";
import {
  MessageSquare,
  CreditCard,
  Star,
  ExternalLink,
  Link2,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaFolderOpen } from "react-icons/fa";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const [{ user, projectCount }, projects] = await Promise.all([
    getDashboardStats(session.user.id),
    getUserProjects(session.user.id),
  ]);

  const u = session.user as typeof session.user & {
    username?: string;
    bio?: string;
    credits?: number;
    totalReviews?: number;
    skills?: string[];
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                    {session.user.name[0]}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold">{session.user.name}</h2>
              {u.username && (
                <p className="text-muted-foreground text-sm">@{u.username}</p>
              )}
              {u.bio && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {u.bio}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: "Credits",
                  value: u.credits ?? 0,
                  icon: CreditCard,
                  color: "text-violet-400",
                },
                {
                  label: "Projects",
                  value: projectCount,
                  icon: FaFolderOpen,
                  color: "text-cyan-400",
                },
                {
                  label: "Reviews",
                  value: u.totalReviews ?? 0,
                  icon: MessageSquare,
                  color: "text-emerald-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-3 rounded-xl bg-secondary"
                >
                  <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                  <div className="font-bold text-sm">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            {u.skills && u.skills.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {u.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-2">
              {u.portfolioUrl && (
                <a
                  href={u.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Link2 className="w-4 h-4" /> Portfolio
                </a>
              )}
              {u.githubUrl && (
                <a
                  href={u.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaGithub className="w-4 h-4" /> GitHub
                </a>
              )}
              {u.linkedinUrl && (
                <a
                  href={u.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaLinkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">My Projects ({projects.length})</h2>
            <Link
              href="/projects/submit"
              className="text-sm text-primary hover:underline"
            >
              + Submit new
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <FaFolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your first project and start getting feedback!
              </p>
              <Link
                href="/projects/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:opacity-90"
              >
                Submit Project (5 credits)
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(
                (project: {
                  id: string;
                  title: string;
                  description: string;
                  category: string;
                  liveUrl: string;
                  tags: string[];
                  createdAt: Date;
                  _count: { feedbacks: number; votes: number };
                }) => {
                  const catLabel =
                    PROJECT_CATEGORIES.find((c) => c.value === project.category)
                      ?.label ?? project.category;
                  return (
                    <div
                      key={project.id}
                      className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs">
                              {catLabel}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(project.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />{" "}
                          {project._count.feedbacks} reviews
                        </Link>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />{" "}
                          {project._count.votes} votes
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
