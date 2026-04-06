import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username max 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  bio: z.string().max(300, "Bio max 300 characters").optional(),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  portfolioUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, "Name required"),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  bio: z.string().max(300).optional(),
  skills: z.array(z.string()).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z
    .string()
    .min(50, "Describe your project in at least 50 characters")
    .max(1000),
  category: z.enum([
    "WEBSITE",
    "MOBILE_APP",
    "SAAS",
    "PORTFOLIO",
    "UI_DESIGN",
    "STARTUP_IDEA",
    "LANDING_PAGE",
    "OTHER",
  ]),
  liveUrl: z.string().url("Must be a valid URL"),
  feedbackType: z.string().min(10, "Describe the feedback you need").max(200),
  tags: z
    .array(z.string())
    .min(1, "Add at least one tag")
    .max(5, "Maximum 5 tags"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

// ─── Feedback ─────────────────────────────────────────────────────────────────

const MIN_FEEDBACK_CHARS = 150;

export const feedbackSchema = z.object({
  firstImpression: z
    .string()
    .min(
      MIN_FEEDBACK_CHARS,
      `First impression must be at least ${MIN_FEEDBACK_CHARS} characters`,
    ),
  whatWorksWell: z
    .string()
    .min(
      MIN_FEEDBACK_CHARS,
      `What works well must be at least ${MIN_FEEDBACK_CHARS} characters`,
    ),
  whatIsConfusing: z
    .string()
    .min(
      MIN_FEEDBACK_CHARS,
      `What's confusing must be at least ${MIN_FEEDBACK_CHARS} characters`,
    ),
  highImpactSuggestion: z
    .string()
    .min(
      MIN_FEEDBACK_CHARS,
      `High-impact suggestion must be at least ${MIN_FEEDBACK_CHARS} characters`,
    ),
  designScore: z.number().min(1).max(5).optional(),
  usabilityScore: z.number().min(1).max(5).optional(),
  clarityScore: z.number().min(1).max(5).optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
