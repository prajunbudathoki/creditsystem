import { getTopReviewers } from "@/actions/profile.actions";
import { Trophy, Star, MessageSquare, Medal } from "lucide-react";

export const metadata = { title: "Leaderboard" };

const BADGE_COLORS: Record<string, string> = {
  TOP_REVIEWER: "text-violet-400 bg-violet-500/10",
  COMMUNITY_HELPER: "text-emerald-400 bg-emerald-500/10",
  UI_CRITIC: "text-cyan-400 bg-cyan-500/10",
  FAST_FEEDBACK: "text-amber-400 bg-amber-500/10",
  FIRST_PROJECT: "text-blue-400 bg-blue-500/10",
  VETERAN_BUILDER: "text-red-400 bg-red-500/10",
};

export default async function LeaderboardPage() {
  const topReviewers = await getTopReviewers(20);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">
              Top reviewers powering the BuildLoop community
            </p>
          </div>
        </div>
      </div>

      {/* Podium top 3 */}
      {topReviewers.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((idx) => {
            const user = topReviewers[idx];
            const rank = idx + 1;
            const sizes = [" md:scale-110", "", ""];
            const colours = [
              "text-amber-400",
              "text-slate-300",
              "text-amber-600",
            ];
            const icons = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={user.id}
                className={`flex flex-col items-center bg-card border border-border rounded-2xl p-5 transition-all ${sizes[idx === 0 ? 1 : idx === 1 ? 0 : 2]}`}
              >
                <span className="text-2xl mb-2">{icons[rank - 1]}</span>
                <div className="w-12 h-12 rounded-xl overflow-hidden mb-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm text-center line-clamp-1">
                  {user.name}
                </p>
                {user.username && (
                  <p className="text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <MessageSquare className="w-3 h-3 text-muted-foreground" />
                  <span className={`text-sm font-bold ${colours[rank - 1]}`}>
                    {user.totalReviews}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Top Reviewers</h2>
        </div>
        <div className="divide-y divide-border">
          {topReviewers.map((user, i) => (
            <div
              key={user.id}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all"
            >
              {/* Rank */}
              <div className="w-8 text-center font-bold text-muted-foreground text-sm flex-shrink-0">
                {i < 3 ? (
                  ["🥇", "🥈", "🥉"][i]
                ) : (
                  <span className="text-muted-foreground">#{i + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {user.name[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  {user.badges.slice(0, 2).map((badge) => (
                    <span
                      key={badge.slug}
                      className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${BADGE_COLORS[badge.slug] ?? "text-muted-foreground bg-secondary"}`}
                    >
                      {badge.icon} {badge.name}
                    </span>
                  ))}
                </div>
                {user.username && (
                  <p className="text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center hidden sm:block">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-semibold text-sm">
                      {user.totalReviews}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-semibold text-sm">
                      {user.credits}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">credits</p>
                </div>
              </div>
            </div>
          ))}

          {topReviewers.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No reviewers yet. Be the first!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
