import { getFeedbacks } from "@/actions/admin.actions";
import { FeedbackActions } from "./FeedbackActions";
import { formatDate, timeAgo } from "@/lib/utils";
import { Star, MessageSquare, AlertCircle } from "lucide-react";

export default async function FeedbackTable({
  query,
  page,
}: {
  query?: string;
  page?: string;
}) {
  const { feedbacks, totalCount } = await getFeedbacks(
    query,
    parseInt(page || "1"),
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
      <div className="p-4 bg-secondary/10 border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {totalCount} Total Entries
        </span>
      </div>
      <div className="divide-y divide-border">
        {feedbacks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No feedback found matching your criteria.
          </div>
        ) : (
          feedbacks.map((f: any) => (
            <div
              key={f.id}
              className="p-6 hover:bg-secondary/30 transition-all group relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-foreground">
                      {f.reviewer.name}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase px-1.5 py-0.5 bg-secondary rounded font-mono">
                      Reviewer
                    </span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <span className="text-sm font-semibold text-primary">
                      {f.project.title}
                    </span>
                    {f.reportedCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-red-500/20 shadow-sm animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        {f.reportedCount} Reports
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
                      <span className="font-bold text-[10px] uppercase text-muted-foreground block mb-0.5">
                        First Impression:
                      </span>
                      &quot;{f.firstImpression}&quot;
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                      <div className="text-xs bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                        <span className="font-bold uppercase text-emerald-500 block mb-1">
                          What Works Well
                        </span>
                        {f.whatWorksWell}
                      </div>
                      <div className="text-xs bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                        <span className="font-bold uppercase text-amber-500 block mb-1">
                          Confusing Points
                        </span>
                        {f.whatIsConfusing}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          Design
                        </span>
                        <span className="text-sm font-bold">
                          {f.designScore}/10
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          Usability
                        </span>
                        <span className="text-sm font-bold">
                          {f.usabilityScore}/10
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          Clarity
                        </span>
                        <span className="text-sm font-bold">
                          {f.clarityScore}/10
                        </span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="text-[10px] text-muted-foreground uppercase">
                      Submitted{" "}
                      <span className="font-bold text-foreground">
                        {timeAgo(f.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <FeedbackActions feedbackId={f.id} />
                  <div
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${f.isHelpful ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    {f.isHelpful ? "Helpful" : "Pending/Unhelpful"}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
