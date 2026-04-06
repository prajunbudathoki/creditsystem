"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Star,
  EyeOff,
  Eye,
  Trash2,
  ExternalLink,
  ChevronDown,
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
  toggleProjectFeatured,
  toggleProjectHidden,
  deleteProjectAdmin,
} from "@/actions/admin.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectActionsProps {
  project: any;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFeatured = async () => {
    try {
      await toggleProjectFeatured(project.id, !project.isFeatured);
      toast.success(
        project.isFeatured ? "Project unfeatured" : "Project featured",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleToggleHidden = async () => {
    try {
      await toggleProjectHidden(project.id, !project.isHidden);
      toast.success(
        project.isHidden ? "Project is now visible" : "Project is now hidden",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProjectAdmin(project.id);
      toast.success("Project deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
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
          <DropdownMenuLabel>Moderation</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleToggleFeatured}>
            <Star
              className={
                project.isFeatured
                  ? "mr-2 h-4 w-4 text-amber-500 fill-amber-500"
                  : "mr-2 h-4 w-4 text-muted-foreground"
              }
            />
            {project.isFeatured ? "Unfeature Project" : "Feature Project"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleHidden}>
            {project.isHidden ? (
              <>
                <Eye className="mr-2 h-4 w-4 text-emerald-500" /> Show Project
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4 text-amber-500" /> Hide Project
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project{" "}
              <strong>{project.title}</strong> and all associated feedback. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
