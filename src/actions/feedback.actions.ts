"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedbackSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ActionResponse, FeedbackWithReviewer } from "@/types";

async function getSession() {
  try {
    const h = await headers();
    return await auth.api.getSession({
      headers: h,
    });
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
}

export async function submitFeedback(
  projectId: string,
  formData: unknown,
): Promise<ActionResponse<{ feedbackId: string }>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  // Anti-spam: parse and validate
  const parsed = feedbackSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { userId: true, title: true },
  });

  if (!project) return { success: false, error: "Project not found" };
  if (project.userId === session.user.id) {
    return { success: false, error: "You cannot review your own project" };
  }

  // Anti-spam: duplicate check (unique constraint in DB also guards)
  const existingFeedback = await db.feedback.findUnique({
    where: { projectId_reviewerId: { projectId, reviewerId: session.user.id } },
  });
  if (existingFeedback) {
    return { success: false, error: "You have already reviewed this project" };
  }

  // Anti-spam: pair review limit (max 2 reviews between same pair in 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const pairReviews = await db.feedback.count({
    where: {
      reviewerId: session.user.id,
      project: { userId: project.userId },
      createdAt: { gte: thirtyDaysAgo },
    },
  });
  if (pairReviews >= 2) {
    return {
      success: false,
      error:
        "You've reviewed too many projects from this user recently. Try again later.",
    };
  }

  const {
    firstImpression,
    whatWorksWell,
    whatIsConfusing,
    highImpactSuggestion,
    designScore,
    usabilityScore,
    clarityScore,
  } = parsed.data;

  const [feedback] = await db.$transaction([
    db.feedback.create({
      data: {
        projectId,
        reviewerId: session.user.id,
        firstImpression,
        whatWorksWell,
        whatIsConfusing,
        highImpactSuggestion,
        designScore,
        usabilityScore,
        clarityScore,
        creditAwarded: true,
      },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: {
        credits: { increment: 3 },
        totalReviews: { increment: 1 },
      },
    }),
    db.creditTransaction.create({
      data: {
        userId: session.user.id,
        type: "EARNED_FEEDBACK",
        amount: 3,
        description: `Gave feedback on: ${project.title}`,
        refId: projectId,
      },
    }),
    // Notify project owner
    db.notification.create({
      data: {
        userId: project.userId,
        type: "FEEDBACK_RECEIVED",
        title: "New feedback received!",
        body: `Someone reviewed your project "${project.title}".`,
        refId: projectId,
      },
    }),
  ]);

  // Check and award badges
  await checkAndAwardBadges(session.user.id);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");

  return { success: true, data: { feedbackId: feedback.id } };
}

export async function getFeedbackForProject(
  projectId: string,
): Promise<FeedbackWithReviewer[]> {
  const feedbacks = await db.feedback.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          totalReviews: true,
        },
      },
    },
  });
  return feedbacks as FeedbackWithReviewer[];
}

export async function markFeedbackHelpful(
  feedbackId: string,
  isHelpful: boolean,
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const feedback = await db.feedback.findUnique({
    where: { id: feedbackId },
    include: { project: { select: { userId: true } } },
  });

  if (!feedback) return { success: false, error: "Feedback not found" };
  if (feedback.project.userId !== session.user.id) {
    return {
      success: false,
      error: "Only the project owner can rate feedback",
    };
  }

  await db.feedback.update({ where: { id: feedbackId }, data: { isHelpful } });

  if (isHelpful) {
    await db.notification.create({
      data: {
        userId: feedback.reviewerId,
        type: "HELPFUL_MARKED",
        title: "Your feedback was marked helpful! 🎉",
        body: "The project owner appreciated your review.",
        refId: feedbackId,
      },
    });
  }

  revalidatePath(`/projects/${feedback.projectId}`);
  return { success: true };
}

async function checkAndAwardBadges(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { totalReviews: true },
  });
  if (!user) return;

  const badgesToCheck: Array<{ slug: string; condition: boolean }> = [
    { slug: "FAST_FEEDBACK", condition: user.totalReviews >= 1 },
    { slug: "COMMUNITY_HELPER", condition: user.totalReviews >= 5 },
    { slug: "TOP_REVIEWER", condition: user.totalReviews >= 20 },
    { slug: "UI_CRITIC", condition: user.totalReviews >= 10 },
  ];

  for (const { slug, condition } of badgesToCheck) {
    if (!condition) continue;

    const badge = await db.badge.findUnique({ where: { slug: slug as never } });
    if (!badge) continue;

    const existing = await db.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });

    if (!existing) {
      await db.$transaction([
        db.userBadge.create({ data: { userId, badgeId: badge.id } }),
        db.notification.create({
          data: {
            userId,
            type: "BADGE_AWARDED",
            title: `Badge Earned: ${badge.name} 🏆`,
            body: badge.description,
          },
        }),
      ]);
    }
  }
}
