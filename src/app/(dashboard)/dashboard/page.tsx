import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/actions/profile.actions";
import { getUserProjects } from "@/actions/project.actions";
import { timeAgo, formatDate } from "@/lib/utils";
import {
  CreditCard,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (!session.user.onboarded) redirect("/onboarding");

  const { user, projectCount, pendingFeedback, recentFeedback, recentTxns } =
    await getDashboardStats(session.user.id);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
         Welcome, {session.user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Credits",
            value: user?.credits ?? 0,
            icon: CreditCard,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
            desc: "Available to spend",
          },
          {
            label: "Projects",
            value: projectCount,
            icon: FolderOpen,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            desc: "Submitted",
          },
          {
            label: "Reviews",
            value: user?.totalReviews ?? 0,
            icon: MessageSquare,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            desc: "Feedback given",
          },
          {
            label: "Feedback",
            value: recentFeedback.length,
            icon: Star,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            desc: "Received",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/20 transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Feedback Received */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Feedback</h2>
            <Link
              href="/explore"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recentFeedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No feedback yet. Submit a project to receive reviews!
              </p>
              <Link
                href="/projects/submit"
                className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
              >
                <Plus className="w-3 h-3" />
                Submit a project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map(
                (fb: {
                  id: string;
                  project: { title: string };
                  reviewer: { name: string; image?: string | null };
                  createdAt: Date;
                  firstImpression: string;
                }) => (
                  <div
                    key={fb.id}
                    className="flex gap-3 p-3 rounded-xl hover:bg-secondary transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {fb.reviewer.image ? (
                        <img
                          src={fb.reviewer.image}
                          alt={fb.reviewer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {fb.reviewer.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {fb.reviewer.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {fb.project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(fb.createdAt)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* Credit History */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Credit Activity</h2>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </div>
          {recentTxns.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No credit activity yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTxns.map(
                (txn: {
                  id: string;
                  type: string;
                  amount: number;
                  description: string;
                  createdAt: Date;
                }) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        txn.amount > 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                      }`}
                    >
                      {txn.amount > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(txn.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        txn.amount > 0 ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {txn.amount > 0 ? "+" : ""}
                      {txn.amount}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            href: "/projects/submit",
            label: "Submit Project",
            desc: "Costs 5 credits",
            icon: Plus,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            href: "/explore",
            label: "Give Feedback",
            desc: "Earn 3 credits",
            icon: MessageSquare,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            href: "/leaderboard",
            label: "Leaderboard",
            desc: "See top reviewers",
            icon: TrendingUp,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 hover:shadow-md transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <p className="font-medium text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {action.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
