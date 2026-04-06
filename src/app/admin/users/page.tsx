import { Suspense } from "react";
import UserTable from "@/components/admin/users/UserTable";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; role?: string; page?: string }>;
}) {
  const { query, role, page } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage your platform users, roles, and credit status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 border border-border rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            className="pl-9 h-10 bg-background"
            defaultValue={query}
          />
        </div>
        <select className="h-10 px-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-40">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full bg-secondary/20 animate-pulse rounded-2xl mt-6" />
        }
      >
        <UserTable query={query} role={role} page={page} />
      </Suspense>
    </div>
  );
}
