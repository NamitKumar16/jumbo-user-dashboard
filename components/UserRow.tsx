"use client";

import React from "react";
import { useRouter } from "next/navigation";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { User } from "@/types/user";
import { useUserModalStore } from "@/store/useUserModalStore";
import { useDeleteUser } from "@/src/hooks/useDeleteUser";

type UserRowProps = {
  user: User;
};

const getInitials = (fullName: string): string => {
  if (!fullName) {
    return "?";
  }

  const parts = fullName.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("");

  return initials || fullName.charAt(0).toUpperCase() || "?";
};

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const router = useRouter();
  const openForEdit = useUserModalStore((state) => state.openForEdit);
  const deleteMutation = useDeleteUser();

  const handleNavigation = () => {
    router.push(`/users/${user.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation();
    }
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    openForEdit(user);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  const handleConfirmDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    deleteMutation.mutate(user.id);
  };

  const companyName = user.company?.name ?? "N/A";
  const initials = getInitials(user.name);

  return (
    <tr
      tabIndex={0}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      className="cursor-pointer bg-white transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/30"
    >
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold uppercase text-white dark:bg-indigo-500">
            {initials}
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {user.name}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600 underline-offset-2 hover:underline dark:text-slate-300">
          {user.email}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {user.phone}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {companyName}
        </p>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleEditClick}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
          >
            Edit
          </button>

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10 dark:focus-visible:ring-red-500/50"
              >
                Delete
              </button>
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm dark:bg-black/60" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none dark:border-slate-800 dark:bg-slate-900">
                <AlertDialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                  Are you sure you want to delete this user?
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </AlertDialog.Description>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
                      onClick={handleDeleteClick}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>

                  <AlertDialog.Action asChild>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-500/40"
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(UserRow);
