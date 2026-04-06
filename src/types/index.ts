import type {
  ProjectCategory,
  BadgeSlug,
  NotificationType,
  CreditTxType,
} from "@prisma/client";

export type { ProjectCategory, BadgeSlug, NotificationType, CreditTxType };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  username?: string | null;
  bio?: string | null;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  skills: string[];
  credits: number;
  totalReviews: number;
  createdAt: Date;
}

export interface ProjectWithMeta {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  thumbnailUrl?: string | null;
  liveUrl: string;
  feedbackType: string;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    username?: string | null;
    image?: string | null;
  };
  _count: {
    feedbacks: number;
    votes: number;
  };
}

export interface FeedbackWithReviewer {
  id: string;
  firstImpression: string;
  whatWorksWell: string;
  whatIsConfusing: string;
  highImpactSuggestion: string;
  designScore?: number | null;
  usabilityScore?: number | null;
  clarityScore?: number | null;
  isHelpful?: boolean | null;
  createdAt: Date;
  reviewer: {
    id: string;
    name: string;
    username?: string | null;
    image?: string | null;
    totalReviews: number;
  };
}

export interface CreditTransactionWithMeta {
  id: string;
  type: CreditTxType;
  amount: number;
  description: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  username?: string | null;
  image?: string | null;
  totalReviews: number;
  credits: number;
  badges: Array<{ slug: BadgeSlug; name: string; icon: string }>;
}

export interface ActionResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
