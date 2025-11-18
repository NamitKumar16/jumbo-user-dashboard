"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";

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

  const handleNavigation = () => {
    router.push(`/users/${user.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation();
    }
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
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Edit / Delete
        </span>
      </td>
    </tr>
  );
};

export default React.memo(UserRow);
