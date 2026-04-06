import { getAdminMetrics } from "@/actions/admin.actions";
import {
  Users,
  FolderOpen,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Star,
} from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const { stats, recentUsers, recentProjects, recentFeedback } =
    await getAdminMetrics();

  const metrics = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      today: stats.newUsersToday,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Projects",
      value: stats.totalProjects,
      today: stats.projectsToday,
      icon: FolderOpen,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Total Feedback",
      value: stats.totalFeedback,
      today: stats.feedbackToday,
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Credit Circ.",
      value: stats.totalCredits,
      today: 0,
      icon: CreditCard,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              {m.today > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Plus className="w-3 h-3" />
                  {m.today} TODAY
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">{m.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Recent Signups
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-primary hover:underline font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                  {u.image ? (
                    <img
                      src={u.image}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-xs font-bold">
                      {u.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate leading-none">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 truncate">
                    {u.email}
                  </p>
                </div>
                <div className="ml-auto text-[10px] text-muted-foreground">
                  {timeAgo(u.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-violet-500" />
                Latest Projects
              </h2>
              <Link
                href="/admin/projects"
                className="text-xs text-primary hover:underline font-medium"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left pb-3 font-medium">Project</th>
                    <th className="text-left pb-3 font-medium">Owner</th>
                    <th className="text-left pb-3 font-medium">Category</th>
                    <th className="text-right pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentProjects.map((p) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 font-medium">{p.title}</td>
                      <td className="py-3 text-muted-foreground">
                        {p.user.name}
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-mono uppercase italic">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 text-right text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-500" />
                Recent Feedback
              </h2>
              <Link
                href="/admin/feedback"
                className="text-xs text-primary hover:underline font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentFeedback.map((f) => (
                <div
                  key={f.id}
                  className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all border border-transparent hover:border-border"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">
                        {f.reviewer.name}{" "}
                        <span className="text-muted-foreground font-normal mx-1">
                          reviewed
                        </span>{" "}
                        {f.project.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(f.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                      &quot;{f.firstImpression}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
