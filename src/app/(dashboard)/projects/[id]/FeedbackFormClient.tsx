"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitFeedback } from "@/actions/feedback.actions";
import { feedbackSchema, type FeedbackFormData } from "@/lib/validations";
import { MessageSquare, Loader2, Star } from "lucide-react";

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-6 h-6 rounded text-xs transition-all ${n <= value ? "text-amber-400" : "text-muted-foreground"}`}
          >
            <Star className={`w-4 h-4 ${n <= value ? "fill-amber-400" : ""}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackFormClient({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState({ design: 0, usability: 0, clarity: 0 });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FeedbackFormData>({ resolver: zodResolver(feedbackSchema) });

  const onSubmit = async (data: FeedbackFormData) => {
    setLoading(true);
    try {
      const result = await submitFeedback(projectId, {
        ...data,
        designScore: scores.design || undefined,
        usabilityScore: scores.usability || undefined,
        clarityScore: scores.clarity || undefined,
      });
      if (result.success) {
        toast.success("Feedback submitted! +3 credits earned 🎉");
        setSubmitted(true);
      } else {
        toast.error(result.error || "Failed to submit");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="font-semibold mb-1">Feedback Submitted! 🎉</h3>
        <p className="text-sm text-muted-foreground">
          +3 credits have been added to your account.
        </p>
      </div>
    );
  }

  const fields = [
    {
      name: "firstImpression" as const,
      label: "First Impression",
      placeholder:
        "Describe your very first impression of the project. What did you notice first? What was the emotional reaction?",
    },
    {
      name: "whatWorksWell" as const,
      label: "What Works Well",
      placeholder:
        "What are the strongest parts of this project? Design, copy, features, speed — be specific.",
    },
    {
      name: "whatIsConfusing" as const,
      label: "What is Confusing",
      placeholder:
        "What parts were unclear, hard to use, or left you with questions? Where did you get stuck?",
    },
    {
      name: "highImpactSuggestion" as const,
      label: "High-Impact Suggestion",
      placeholder:
        "One specific, actionable change that would make the biggest improvement to this project.",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Write a Review</h3>
          <p className="text-xs text-muted-foreground">
            Earn +3 credits for quality feedback
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => {
          const charCount = watch(field.name)?.length ?? 0;
          return (
            <div key={field.name}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {field.label}
                </label>
                <span
                  className={`text-xs ${charCount >= 150 ? "text-emerald-400" : "text-muted-foreground"}`}
                >
                  {charCount}/150
                </span>
              </div>
              <textarea
                {...register(field.name)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
              {errors[field.name] && (
                <p className="text-xs text-destructive mt-0.5">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          );
        })}

        {/* Scores */}
        <div className="p-3 rounded-xl bg-secondary/50 space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Optional Scores
          </p>
          <ScoreInput
            label="Design"
            value={scores.design}
            onChange={(v) => setScores((s) => ({ ...s, design: v }))}
          />
          <ScoreInput
            label="Usability"
            value={scores.usability}
            onChange={(v) => setScores((s) => ({ ...s, usability: v }))}
          />
          <ScoreInput
            label="Clarity"
            value={scores.clarity}
            onChange={(v) => setScores((s) => ({ ...s, clarity: v }))}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Feedback (+3 credits)
        </button>
      </form>
    </div>
  );
}
