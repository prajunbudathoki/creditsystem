"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectSchema } from "@/lib/validations";
import { CREDIT_COSTS } from "@/lib/utils";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ActionResponse, ProjectWithMeta } from "@/types";

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

export async function submitProject(
  formData: unknown,
): Promise<ActionResponse<{ projectId: string }>> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { success: false, error: "User not found" };
  if (user.credits < 5) {
    return {
      success: false,
      error:
        "Insufficient credits. You need at least 5 credits to submit a project.",
    };
  }

  const {
    title,
    description,
    category,
    thumbnailUrl,
    liveUrl,
    feedbackType,
    tags,
  } = parsed.data;

  const [project] = await db.$transaction([
    db.project.create({
      data: {
        userId: session.user.id,
        title,
        description,
        category,
        thumbnailUrl: thumbnailUrl || null,
        liveUrl,
        feedbackType,
        tags,
      },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 5 } },
    }),
    db.creditTransaction.create({
      data: {
        userId: session.user.id,
        type: "SPENT_SUBMIT",
        amount: CREDIT_COSTS.SUBMIT_PROJECT,
        description: `Submitted project: ${title}`,
      },
    }),
    db.notification.create({
      data: {
        userId: session.user.id,
        type: "FEEDBACK_RECEIVED",
        title: "Project submitted!",
        body: `Your project "${title}" is now live and ready for feedback.`,
      },
    }),
  ]);

  revalidatePath("/explore");
  revalidatePath("/dashboard");

  return { success: true, data: { projectId: project.id } };
}

export async function getProjects(
  filter: "trending" | "new" | "featured" | "most-reviewed" = "new",
  limit = 12,
  category?: string,
): Promise<ProjectWithMeta[]> {
  const where = {
    status: "ACTIVE" as const,
    ...(category ? { category: category as ProjectWithMeta["category"] } : {}),
    ...(filter === "featured" ? { isFeatured: true } : {}),
  };

  const orderBy =
    filter === "trending"
      ? { viewCount: "desc" as const }
      : filter === "most-reviewed"
        ? {}
        : { createdAt: "desc" as const };

  const projects = await db.project.findMany({
    where,
    take: limit,
    orderBy: filter === "most-reviewed" ? undefined : orderBy,
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { feedbacks: true, votes: true } },
    },
  });

  if (filter === "most-reviewed") {
    projects.sort((a, b) => b._count.feedbacks - a._count.feedbacks);
  }

  return projects as ProjectWithMeta[];
}

export async function getProjectById(id: string) {
  const project = await db.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          credits: true,
        },
      },
      _count: { select: { feedbacks: true, votes: true } },
    },
  });

  if (project) {
    await db.project.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return project;
}

export async function getUserProjects(userId: string) {
  return db.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { feedbacks: true, votes: true } },
    },
  });
}

export async function voteProject(projectId: string): Promise<ActionResponse> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const existing = await db.vote.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId } },
  });

  if (existing) {
    await db.vote.delete({ where: { id: existing.id } });
    return { success: true, message: "Vote removed" };
  }

  await db.vote.create({ data: { userId: session.user.id, projectId } });
  return { success: true, message: "Voted!" };
}
