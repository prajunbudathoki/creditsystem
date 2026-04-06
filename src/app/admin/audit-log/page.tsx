import { getAuditLogs } from "@/actions/admin.actions";
import { formatDate, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { History, Shield, Activity, AlertCircle } from "lucide-react";
import { Suspense } from "react";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary">
          <History className="w-6 h-6" />
          Audit Log
        </h1>
        <p className="text-muted-foreground text-sm">
          A security trail of all administrative and critical platform actions.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full bg-secondary/20 animate-pulse rounded-2xl" />
        }
      >
        <LogItems page={page} />
      </Suspense>
    </div>
  );
}

async function LogItems({ page }: { page?: string }) {
  const { logs, totalCount } = await getAuditLogs(parseInt(page || "1"));

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-secondary/10 border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Showing latest {logs.length} events
        </span>
        <span className="text-[10px] text-muted-foreground uppercase font-mono">
          {totalCount} Total Logs
        </span>
      </div>
      <div className="divide-y divide-border">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground italic">
            No system logs recorded yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-secondary/30 transition-all flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant="outline"
                    className="font-mono text-[9px] uppercase font-bold tracking-wider"
                  >
                    {log.action}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">
                    {log.user?.name || "System"}
                  </span>
                  <span className="text-muted-foreground"> performed on </span>
                  <span className="font-semibold text-foreground">
                    {log.entity || "System"}
                  </span>
                  {log.entityId && (
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded ml-2 uppercase font-mono">
                      {log.entityId}
                    </span>
                  )}
                </div>
                {log.details && (
                  <pre className="mt-2 p-2 bg-secondary/50 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto border border-border/50">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
                <div className="text-[10px] text-muted-foreground mt-1 lowercase italic">
                  {timeAgo(log.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
