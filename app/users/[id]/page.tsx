"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";
import { api } from "@/lib/api";
import { addActivity } from "@/store/useActivityLog";

const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
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
  const breadcrumbName = user?.name ?? "User";
  const lastLoggedUser = useRef<number | null>(null);

  useEffect(() => {
    if (user?.id && lastLoggedUser.current !== user.id) {
      addActivity({
        type: "VIEW",
        userId: user.id,
        userName: user.name,
        details: "Viewed user detail page",
      });
      lastLoggedUser.current = user.id;
    }
  }, [user]);

  let content: React.ReactNode = null;

  if (!userId) {
    content = (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Missing user identifier. Please go back and try again.
      </p>
    );
  } else if (isLoading) {
    content = (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading user details...
        </p>
      </div>
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
      <div className="space-y-10">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-md ring-1 ring-black/5 dark:border-slate-800/70 dark:bg-slate-900/90 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 opacity-90 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/60 bg-white text-3xl font-semibold uppercase text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  {avatarInitials}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  User Overview
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {user.name}
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  {user.company?.name ?? "No company listed"}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-6 py-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Primary Contact
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                {user.email}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Contact Information
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                  Stay connected with {user.name}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl bg-slate-50/80 p-4 dark:bg-slate-950/40">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M4 6.5 10.8 12a1.5 1.5 0 0 0 2.4 0L20 6.5" />
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${user.email}`}
                    className="mt-1 block text-base font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    {user.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-slate-50/80 p-4 dark:bg-slate-950/40">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                    <path d="M12 18h.01" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    Phone
                  </p>
                  <a
                    href={`tel:${user.phone}`}
                    className="mt-1 block text-base font-medium text-slate-900 hover:underline dark:text-white"
                  >
                    {user.phone}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M3 10h18" />
                  <path d="M7 10v8" />
                  <path d="M17 10v8" />
                  <path d="M5 6h14a2 2 0 0 1 2 2v12H3V8a2 2 0 0 1 2-2z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Company Details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  {user.company?.name ?? "N/A"}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {user.company?.name
                    ? `Main organization associated with ${user.name}.`
                    : "No company description available."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  Address Details
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  Primary Location
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {[
                    user.address?.street,
                    user.address?.city,
                    user.address?.zipcode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="font-medium">Users</li>
            <li className="text-slate-400 dark:text-slate-500">/</li>
            <li className="font-semibold text-slate-900 dark:text-white">
              {breadcrumbName}
            </li>
          </ol>
        </nav>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-800/70 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Users
        </button>

        <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl ring-1 ring-black/5 dark:border-slate-800/60 dark:bg-slate-900 sm:p-8">
          {content}
        </section>
      </div>
    </main>
  );
};

export default UserDetailsPage;
