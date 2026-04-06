"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/actions/profile.actions";
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations";
import { Zap, ArrowRight, ArrowLeft, Loader2, X, Plus } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "UI/UX",
  "Figma",
  "GraphQL",
  "Vue.js",
  "Flutter",
  "Swift",
  "Go",
  "Product Design",
  "Marketing",
  "SEO",
  "Copywriting",
];

const STEPS = [
  {
    title: "Choose your username",
    description: "This will be your public identity on BuildLoop",
  },
  {
    title: "Tell us about yourself",
    description: "Help other builders know who you are",
  },
  {
    title: "Add your skills & links",
    description: "Connect your portfolio and social profiles",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({ resolver: zodResolver(onboardingSchema) });

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill) && skills.length < 8) {
      const updated = [...skills, skill];
      setSkills(updated);
      setValue("skills", updated);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    setValue("skills", updated);
  };

  const nextStep = async () => {
    const fields: (keyof OnboardingFormData)[][] = [
      ["username"],
      ["bio"],
      ["skills", "portfolioUrl", "githubUrl", "linkedinUrl"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setLoading(true);
    try {
      const result = await completeOnboarding({ ...data, skills });
      if (result.success) {
        toast.success("Welcome to BuildLoop! 🎉");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{STEPS[step].title}</h1>
          <p className="text-muted-foreground mt-1">
            {STEPS[step].description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Username *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        @
                      </span>
                      <input
                        {...register("username")}
                        placeholder="yourname"
                        className="w-full pl-8 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Bio (optional)
                    </label>
                    <textarea
                      {...register("bio")}
                      placeholder="I'm a developer who loves building SaaS products..."
                      rows={4}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    {errors.bio && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Skills * (pick at least one)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                        >
                          {s}
                          <button type="button" onClick={() => removeSkill(s)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s))
                        .slice(0, 10)
                        .map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => addSkill(s)}
                            className="px-3 py-1 rounded-lg bg-secondary border border-border text-xs hover:border-primary hover:text-primary transition-colors"
                          >
                            + {s}
                          </button>
                        ))}
                    </div>
                    {errors.skills && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "portfolioUrl" as const,
                        label: "Portfolio URL (optional)",
                        placeholder: "https://yourportfolio.com",
                      },
                      {
                        name: "githubUrl" as const,
                        label: "GitHub URL (optional)",
                        placeholder: "https://github.com/username",
                      },
                      {
                        name: "linkedinUrl" as const,
                        label: "LinkedIn URL (optional)",
                        placeholder: "https://linkedin.com/in/username",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          {field.label}
                        </label>
                        <input
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                        {errors[field.name] && (
                          <p className="text-xs text-destructive mt-1">
                            {errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-secondary text-sm font-medium transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Enter BuildLoop 🚀
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
