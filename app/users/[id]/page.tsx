"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";

const fetchUserById = async (id: string): Promise<User> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch user");
  }

  return response.json();
};

const getInitials = (fullName: string): string => {
  if (!fullName) {
    return "?";
  }

  const segments = fullName.trim().split(/\s+/).slice(0, 2);
  const initials = segments
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");

  return initials || fullName.charAt(0).toUpperCase() || "?";
};

const UserDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const userId = Array.isArray(rawId) ? rawId[0] : rawId;

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });

  const avatarInitials = useMemo(
    () => (user ? getInitials(user.name) : "?"),
    [user]
  );

  let content: React.ReactNode = null;

  if (!userId) {
    content = (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Missing user identifier. Please go back and try again.
      </p>
    );
  } else if (isLoading) {
    content = (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Loading user details...
      </p>
    );
  } else if (isError) {
    content = (
      <div className="space-y-3 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load user details.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          Try again
        </button>
      </div>
    );
  } else if (!user) {
    content = (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        User not found.
      </p>
    );
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold uppercase text-white dark:bg-indigo-500">
              {avatarInitials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.company?.name ?? "No company listed"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Email
            </p>
            <a
              href={`mailto:${user.email}`}
              className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {user.email}
            </a>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Phone
            </p>
            <a
              href={`tel:${user.phone}`}
              className="mt-1 block text-sm font-medium text-slate-800 hover:underline dark:text-slate-200"
            >
              {user.phone}
            </a>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Company
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {user.company?.name ?? "N/A"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Address
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
              {[user.address?.street, user.address?.city, user.address?.zipcode]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
        >
          ← Back to Users
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {content}
        </section>
      </div>
    </main>
  );
};

export default UserDetailsPage;
