import { getProjectById } from "@/actions/project.actions";
import { getFeedbackForProject } from "@/actions/feedback.actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { timeAgo, PROJECT_CATEGORIES } from "@/lib/utils";
import {
  ExternalLink,
  MessageSquare,
  Star,
  Heart,
  Calendar,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { FeedbackFormClient } from "./FeedbackFormClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, feedbacks, session] = await Promise.all([
    getProjectById(id),
    getFeedbackForProject(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!project) notFound();

  const isOwner = session?.user.id === project.userId;
  const hasReviewed = feedbacks.some((f) => f.reviewer.id === session?.user.id);
  const categoryLabel =
    PROJECT_CATEGORIES.find((c) => c.value === project.category)?.label ??
    project.category;
  const avgScore =
    feedbacks.length > 0
      ? Math.round(
          (feedbacks.reduce(
            (sum, f) =>
              sum +
              ((f.designScore ?? 0) +
                (f.usabilityScore ?? 0) +
                (f.clarityScore ?? 0)) /
                3,
            0,
          ) /
            feedbacks.length) *
            10,
        ) / 10
      : null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      {/* Project Header */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        {project.thumbnailUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-medium">
                  {categoryLabel}
                </span>
                {project.isFeatured && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{project.title}</h1>
            </div>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:border-violet-500/50 text-sm font-medium transition-all flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </a>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {project.user.image ? (
                <img
                  src={project.user.image}
                  alt={project.user.name}
                  className="w-6 h-6 rounded-lg"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {project.user.name[0]}
                </div>
              )}
              <span>
                by{" "}
                <strong className="text-foreground">{project.user.name}</strong>
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {timeAgo(project.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {project._count.feedbacks} reviews
            </span>
            {avgScore && (
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                {avgScore} avg score
              </span>
            )}
          </div>

          {/* Feedback Request */}
          <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm">
              <span className="font-semibold text-blue-300">
                Feedback wanted:{" "}
              </span>
              <span className="text-muted-foreground">
                {project.feedbackType}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Leave Feedback */}
        <div className="lg:col-span-2">
          {!session ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to give feedback and earn 3 credits
              </p>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-md hover:opacity-90 transition-all"
              >
                Sign In
              </Link>
            </div>
          ) : isOwner ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                This is your project. You cannot review your own work.
              </p>
            </div>
          ) : hasReviewed ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="font-medium mb-1">Feedback submitted!</p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve already reviewed this project.
              </p>
            </div>
          ) : (
            <FeedbackFormClient projectId={project.id} />
          )}
        </div>

        {/* Feedback List */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="font-semibold text-lg">{feedbacks.length} Reviews</h2>
          {feedbacks.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-1">No reviews yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to give feedback and earn 3 credits!
              </p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {feedback.reviewer.image ? (
                      <img
                        src={feedback.reviewer.image}
                        alt={feedback.reviewer.name}
                        className="w-8 h-8 rounded-lg"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {feedback.reviewer.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {feedback.reviewer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(feedback.createdAt)}
                      </p>
                    </div>
                  </div>
                  {feedback.designScore && (
                    <div className="flex gap-2 text-xs">
                      {[
                        { label: "Design", score: feedback.designScore },
                        { label: "UX", score: feedback.usabilityScore },
                        { label: "Clarity", score: feedback.clarityScore },
                      ]
                        .filter((s) => s.score)
                        .map((s) => (
                          <span
                            key={s.label}
                            className="px-2 py-0.5 rounded bg-secondary"
                          >
                            {s.label} {s.score}/5
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "First Impression",
                      value: feedback.firstImpression,
                    },
                    {
                      label: "What Works Well",
                      value: feedback.whatWorksWell,
                    },
                    {
                      label: "What is Confusing",
                      value: feedback.whatIsConfusing,
                    },
                    {
                      label: "High-Impact Suggestion",
                      value: feedback.highImpactSuggestion,
                    },
                  ].map((section) => (
                    <div key={section.label}>
                      <p
                        className={`text-xs font-semibold mb-1`}
                      >
                        {section.label}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.value}
                      </p>
                    </div>
                  ))}
                </div>

                {feedback.isHelpful !== null && (
                  <div
                    className={`mt-4 flex items-center gap-1.5 text-xs ${feedback.isHelpful ? "text-emerald-400" : ""}`}
                  >
                    <Heart className="w-3 h-3" />
                    {feedback.isHelpful
                      ? "Marked helpful by owner"
                      : "Not marked helpful"}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
