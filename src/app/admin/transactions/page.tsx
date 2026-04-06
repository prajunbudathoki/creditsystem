import { getTransactions } from "@/actions/admin.actions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; page?: string }>;
}) {
  const { query, type, page } = await searchParams;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Credit Transactions
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitor the platform credit economy and verify reward distributions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by user name or email..."
            className="pl-9 bg-card border-border shadow-sm"
            defaultValue={query}
          />
        </div>
        <select
          defaultValue={type}
          className="h-10 px-4 rounded-md border border-input bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-48"
        >
          <option value="">All Types</option>
          <option value="EARNED_FEEDBACK">Earned Feedback</option>
          <option value="SPENT_SUBMIT">Spent Submit</option>
          <option value="SPENT_BOOST">Spent Boost</option>
          <option value="BONUS_SIGNUP">Bonus Signup</option>
          <option value="ADMIN_ADJUSTMENT">Admin Adjustment</option>
        </select>
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full bg-secondary/20 animate-pulse rounded-2xl" />
        }
      >
        <TransactionTable query={query} type={type} page={page} />
      </Suspense>
    </div>
  );
}

async function TransactionTable({
  query,
  type,
  page,
}: {
  query?: string;
  type?: string;
  page?: string;
}) {
  const { transactions, totalCount } = await getTransactions(
    query,
    type,
    parseInt(page || "1"),
  );

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground">
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-4 font-medium uppercase tracking-wider">
                Description
              </th>
              <th className="text-right px-6 py-4 font-medium uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground italic"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="group hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {txn.user.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {txn.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="font-mono text-[9px] uppercase tracking-tighter"
                    >
                      {txn.type.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 font-bold ${txn.amount > 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {txn.amount > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {txn.amount > 0 ? "+" : ""}
                      {txn.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground italic truncate max-w-xs">
                    {txn.description}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground font-mono text-[10px]">
                    {formatDate(txn.createdAt)}
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
