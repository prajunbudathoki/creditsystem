import { getUsers } from "@/actions/admin.actions";
import { UserActions } from "./UserActions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function UserTable({
  query,
  role,
  page,
}: {
  query?: string;
  role?: string;
  page?: string;
}) {
  const { users, totalPages } = await getUsers(
    query,
    role,
    parseInt(page || "1"),
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground">
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-6 py-4 font-medium uppercase tracking-wider">
                Credits
              </th>
              <th className="text-center px-6 py-4 font-medium uppercase tracking-wider">
                Activity
              </th>
              <th className="text-right px-6 py-4 font-medium uppercase tracking-wider">
                Joined
              </th>
              <th className="w-10 px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold overflow-hidden border border-border">
                        {user.image ? (
                          <img src={user.image} alt={user.name} />
                        ) : (
                          user.name[0]
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                      className="font-mono text-[10px]"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.isSuspended ? (
                      <span className="flex items-center gap-1.5 text-red-500 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Suspended
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-amber-500">
                    {user.credits}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {user._count.projects} Projects
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {user._count.feedbacks} Reviews
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground italic">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActions user={user} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
