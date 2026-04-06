"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Coins,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  updateUserRole,
  toggleUserSuspension,
  adjustUserCredits,
} from "@/actions/admin.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserActionsProps {
  user: any;
}

export function UserActions({ user }: UserActionsProps) {
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = async (newRole: "USER" | "ADMIN") => {
    try {
      await updateUserRole(user.id, newRole);
      toast.success(`User promoted to ${newRole}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleToggleSuspension = async () => {
    try {
      await toggleUserSuspension(user.id, !user.isSuspended);
      toast.success(user.isSuspended ? "User unsuspended" : "User suspended");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleAdjustCredits = async () => {
    setIsLoading(true);
    try {
      await adjustUserCredits(user.id, creditAmount, creditReason);
      toast.success("Credits adjusted successfully");
      setIsCreditOpen(false);
      setCreditAmount(0);
      setCreditReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust credits");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              handleRoleChange(user.role === "ADMIN" ? "USER" : "ADMIN")
            }
          >
            {user.role === "ADMIN" ? (
              <>
                <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" /> Demote
                to User
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4 text-primary" /> Promote to
                Admin
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsCreditOpen(true)}>
            <Coins className="mr-2 h-4 w-4 text-amber-500" />
            Adjust Credits
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleToggleSuspension}
            className={user.isSuspended ? "text-emerald-500" : "text-amber-500"}
          >
            {user.isSuspended ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Unsuspend User
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" /> Suspend User
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-not-allowed opacity-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User (Disabled)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Credits</DialogTitle>
            <DialogDescription>
              Add or remove credits for <strong>{user.name}</strong>. Use
              negative numbers to deduct.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={creditAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCreditAmount(parseInt(e.target.value))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g. Compensation for bug"
                value={creditReason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCreditReason(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdjustCredits}
              disabled={isLoading || !creditReason}
            >
              {isLoading ? "Processing..." : "Update Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
