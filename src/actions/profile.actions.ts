"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingSchema, profileSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ActionResponse, LeaderboardEntry } from "@/types";

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

export async function getCreditHistory(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return db.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}

export async function getTopReviewers(limit = 10): Promise<LeaderboardEntry[]> {
  const users = await db.user.findMany({
    where: { totalReviews: { gt: 0 } },
    orderBy: { totalReviews: "desc" },
    take: limit,
    include: {
      badges: {
        include: { badge: true },
      },
    },
  });

  return users.map((u: any) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    image: u.image,
    totalReviews: u.totalReviews,
    credits: u.credits,
    badges: u.badges.map((ub: any) => ({
      slug: ub.badge.slug,
      name: ub.badge.name,
      icon: ub.badge.icon,
    })),
  }));
}

export async function getPublicProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    include: {
      projects: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { _count: { select: { feedbacks: true, votes: true } } },
      },
      badges: { include: { badge: true } },
      _count: { select: { feedbacks: true, projects: true } },
    },
  });
  return user;
}

export async function updateProfile(
  formData: unknown,
): Promise<ActionResponse> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Check username uniqueness
  const { username, name, bio, skills, portfolioUrl, githubUrl, linkedinUrl } =
    parsed.data;

  const existingUser = await db.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
  });
  if (existingUser) {
    return { success: false, error: "Username is already taken" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(name && { name }),
      username,
      bio: bio || null,
      skills: skills || [],
      portfolioUrl: portfolioUrl || null,
      githubUrl: githubUrl || null,
      linkedinUrl: linkedinUrl || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { success: true };
}

export async function completeOnboarding(data: any): Promise<ActionResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Onboarding validation error:", parsed.error.issues);
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { username, bio, skills, portfolioUrl, githubUrl, linkedinUrl } =
    parsed.data;

  try {
    const existingUser = await db.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
    });

    if (existingUser) {
      return { success: false, error: "Username is already taken" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        username,
        bio: bio || null,
        skills: skills || [],
        portfolioUrl: portfolioUrl || null,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        onboarded: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Onboarding update error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getDashboardStats(userId: string) {
  const [user, projectCount, pendingFeedback, recentFeedback, recentTxns] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { credits: true, totalReviews: true },
      }),
      db.project.count({ where: { userId } }),
      db.project.findMany({
        where: { userId, status: "ACTIVE" },
        select: {
          id: true,
          title: true,
          _count: { select: { feedbacks: true } },
        },
      }),
      db.feedback.findMany({
        where: { project: { userId } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          reviewer: { select: { name: true, image: true, username: true } },
          project: { select: { title: true } },
        },
      }),
      db.creditTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return { user, projectCount, pendingFeedback, recentFeedback, recentTxns };
}

export async function getNotifications(userId: string) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotifRead(notifId: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };
  await db.notification.update({
    where: { id: notifId, userId: session.user.id },
    data: { isRead: true },
  });
  return { success: true };
}
