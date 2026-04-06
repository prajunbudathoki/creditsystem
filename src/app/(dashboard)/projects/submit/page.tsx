"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { submitProject } from "@/actions/project.actions";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { PROJECT_CATEGORIES } from "@/lib/utils";
import { PlusCircle, Loader2, X, Tag } from "lucide-react";

export default function SubmitProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tags: [],
      category: "" as any,
    },
  });

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      const next = [...tags, tag];
      setTags(next);
      setValue("tags", next);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    setValue("tags", next);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const result = await submitProject({ ...data, tags });
      if (result.success) {
        toast.success("Project submitted! 🎉 5 credits deducted.");
        router.push(`/projects/${result.data?.projectId}`);
      } else {
        toast.error(result.error || "Failed to submit");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Submit Your Project</h1>
              <p className="text-sm text-muted-foreground">
                Costs 5 credits — get structured feedback from builders
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-amber-400/10 border border-amber-500/20">
            <p className="text-sm text-amber-500">
              <strong>Tip:</strong> Be specific about the feedback you need.
              Better descriptions attract better reviewers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Project Title *
            </label>
            <input
              {...register("title")}
              placeholder="My awesome SaaS product"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Description *
            </label>
            <textarea
              {...register("description")}
              placeholder="What does your project do? Who is it for? What problem does it solve?"
              rows={4}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Select a category</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-destructive mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Live URL *
            </label>
            <input
              {...register("liveUrl")}
              placeholder="https://yourproject.com"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.liveUrl && (
              <p className="text-xs text-destructive mt-1">
                {errors.liveUrl.message}
              </p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Screenshot / Thumbnail URL (optional)
            </label>
            <input
              {...register("thumbnailUrl")}
              placeholder="https://i.imgur.com/screenshot.png"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.thumbnailUrl && (
              <p className="text-xs text-destructive mt-1">
                {errors.thumbnailUrl.message}
              </p>
            )}
          </div>

          {/* Feedback Type */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              What feedback do you need? *
            </label>
            <input
              {...register("feedbackType")}
              placeholder="e.g. UX usability review, first impression, conversion rate feedback"
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {errors.feedbackType && (
              <p className="text-xs text-destructive mt-1">
                {errors.feedbackType.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium block mb-1.5">
              Tags * (up to 5)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="saas, react, landing-page..."
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm hover:border-primary transition-all"
              >
                Add
              </button>
            </div>
            {errors.tags && (
              <p className="text-xs text-destructive mt-1">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Project (−5 credits)
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
