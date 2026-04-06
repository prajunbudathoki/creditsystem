"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function ensureAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminMetrics() {
  await ensureAdmin();

  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const lastWeek = new Date(now.setDate(now.getDate() - 7));

  const [
    totalUsers,
    totalProjects,
    totalFeedback,
    totalCredits,
    newUsersToday,
    projectsToday,
    feedbackToday,
  ] = await Promise.all([
    db.user.count(),
    db.project.count(),
    db.feedback.count(),
    db.creditTransaction.aggregate({
      _sum: { amount: true },
    }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.project.count({ where: { createdAt: { gte: today } } }),
    db.feedback.count({ where: { createdAt: { gte: today } } }),
  ]);

  // Recent activity
  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true, image: true },
  });

  const recentProjects = await db.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const recentFeedback = await db.feedback.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      reviewer: { select: { name: true } },
      project: { select: { title: true } },
    },
  });

  return {
    stats: {
      totalUsers,
      totalProjects,
      totalFeedback,
      totalCredits: totalCredits._sum.amount ?? 0,
      newUsersToday,
      projectsToday,
      feedbackToday,
    },
    recentUsers,
    recentProjects,
    recentFeedback,
  };
}

export async function getUsers(
  query: string = "",
  role?: string,
  page: number = 1,
) {
  await ensureAdmin();
  const take = 10;
  const skip = (page - 1) * take;

  const where: any = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { username: { contains: query, mode: "insensitive" } },
    ],
  };

  if (role) {
    where.role = role;
  }

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { projects: true, feedbacks: true },
        },
      },
    }),
    db.user.count({ where }),
  ]);

  return {
    users,
    totalCount,
    totalPages: Math.ceil(totalCount / take),
  };
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  const session = await ensureAdmin();

  // Prevent self-demotion
  if (userId === session.user.id && role !== "ADMIN") {
    throw new Error("Cannot demote yourself");
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { role },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE_USER_ROLE",
      entity: "User",
      entityId: userId,
      details: { oldRole: "UPDATING", newRole: role }, // Simplified for now
    },
  });

  return user;
}

export async function toggleUserSuspension(
  userId: string,
  isSuspended: boolean,
) {
  const session = await ensureAdmin();

  const user = await db.user.update({
    where: { id: userId },
    data: { isSuspended },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: isSuspended ? "SUSPEND_USER" : "UNSUSPEND_USER",
      entity: "User",
      entityId: userId,
    },
  });

  return user;
}

export async function adjustUserCredits(
  userId: string,
  amount: number,
  reason: string,
) {
  const session = await ensureAdmin();

  const [user, txn] = await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    }),
    db.creditTransaction.create({
      data: {
        userId,
        type: "ADMIN_ADJUSTMENT",
        amount,
        description: `Admin: ${reason}`,
      },
    }),
  ]);

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADJUST_CREDITS",
      entity: "User",
      entityId: userId,
      details: { amount, reason },
    },
  });

  return { user, txn };
}

export async function getProjects(
  query: string = "",
  category?: string,
  page: number = 1,
) {
  await ensureAdmin();
  const take = 10;
  const skip = (page - 1) * take;

  const where: any = {
    title: { contains: query, mode: "insensitive" },
  };

  if (category) {
    where.category = category;
  }

  const [projects, totalCount] = await Promise.all([
    db.project.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { feedbacks: true } },
      },
    }),
    db.project.count({ where }),
  ]);

  return {
    projects,
    totalCount,
    totalPages: Math.ceil(totalCount / take),
  };
}

export async function toggleProjectFeatured(
  projectId: string,
  isFeatured: boolean,
) {
  const session = await ensureAdmin();

  const project = await db.project.update({
    where: { id: projectId },
    data: { isFeatured },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: isFeatured ? "FEATURE_PROJECT" : "UNFEATURE_PROJECT",
      entity: "Project",
      entityId: projectId,
    },
  });

  return project;
}

export async function toggleProjectHidden(
  projectId: string,
  isHidden: boolean,
) {
  const session = await ensureAdmin();

  const project = await db.project.update({
    where: { id: projectId },
    data: { isHidden },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: isHidden ? "HIDE_PROJECT" : "UNHIDE_PROJECT",
      entity: "Project",
      entityId: projectId,
    },
  });

  return project;
}

export async function deleteProjectAdmin(projectId: string) {
  const session = await ensureAdmin();

  const project = await db.project.delete({
    where: { id: projectId },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE_PROJECT",
      entity: "Project",
      entityId: projectId,
      details: { title: project.title },
    },
  });

  return project;
}

export async function getFeedbacks(query: string = "", page: number = 1) {
  await ensureAdmin();
  const take = 10;
  const skip = (page - 1) * take;

  const where: any = {
    OR: [
      { firstImpression: { contains: query, mode: "insensitive" } },
      { reviewer: { name: { contains: query, mode: "insensitive" } } },
      { project: { title: { contains: query, mode: "insensitive" } } },
    ],
  };

  const [feedbacks, totalCount] = await Promise.all([
    db.feedback.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
    }),
    db.feedback.count({ where }),
  ]);

  return {
    feedbacks,
    totalCount,
    totalPages: Math.ceil(totalCount / take),
  };
}

export async function deleteFeedbackAdmin(feedbackId: string) {
  const session = await ensureAdmin();

  const feedback = await db.feedback.delete({
    where: { id: feedbackId },
  });

  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE_FEEDBACK",
      entity: "Feedback",
      entityId: feedbackId,
    },
  });

  return feedback;
}

export async function getTransactions(
  query: string = "",
  type?: string,
  page: number = 1,
) {
  await ensureAdmin();
  const take = 20;
  const skip = (page - 1) * take;

  const where: any = {};
  if (query) {
    where.user = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };
  }
  if (type) {
    where.type = type;
  }

  const [transactions, totalCount] = await Promise.all([
    db.creditTransaction.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    db.creditTransaction.count({ where }),
  ]);

  return {
    transactions,
    totalCount,
    totalPages: Math.ceil(totalCount / take),
  };
}

export async function getAuditLogs(page: number = 1) {
  await ensureAdmin();
  const take = 50;
  const skip = (page - 1) * take;

  const [logs, totalCount] = await Promise.all([
    db.auditLog.findMany({
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    db.auditLog.count(),
  ]);

  return {
    logs,
    totalCount,
    totalPages: Math.ceil(totalCount / take),
  };
}
