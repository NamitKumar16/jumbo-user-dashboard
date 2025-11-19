"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import * as Select from "@radix-ui/react-select";
import AddUserDialog from "@/src/components/AddUserDialog";
import UserRow from "@/components/UserRow";
import type { User } from "@/types/user";
import { api } from "@/lib/api";
import { useUserManagementStore } from "@/store/useUserManagementStore";

const ITEMS_PER_PAGE = 5;
const USERS_QUERY_KEY = ["users"] as const;

const fetchUsers = async (queryClient: QueryClient): Promise<User[]> => {
  const cached = queryClient.getQueryData<User[]>(USERS_QUERY_KEY);
  if (cached) {
    return cached;
  }

  const res = await api.get<User[]>("/users");
  queryClient.setQueryData(USERS_QUERY_KEY, res.data);
  return res.data;
};

export const dynamic = "force-dynamic";
export const revalidate = 0; // prevent Next.js from forcing refetches

const ChevronDownIcon = ({
  className = "h-4 w-4",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m6 9 6 6 6-6"
    />
  </svg>
);

const ChevronUpIcon = ({
  className = "h-4 w-4",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m18 15-6-6-6 6"
    />
  </svg>
);

const CheckIcon = ({
  className = "h-4 w-4",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const UserTable: React.FC = () => {
  const deletedIds = useUserManagementStore((state) => state.deletedUserIds);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: cachedUsers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<User[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => fetchUsers(queryClient),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: Infinity, // NEVER garbage-collect users list
    enabled: true, // ensure query only runs once
  });

  const users = useMemo(
    () => cachedUsers.filter((user) => !deletedIds.includes(user.id)),
    [cachedUsers, deletedIds]
  );

  const companies = useMemo(() => {
    const names = users
      .map((user) => user.company?.name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [users]);

  const processedUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    let filtered = [...users];

    if (query) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
    }

    if (companyFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.company?.name === companyFilter
      );
    }

    filtered.sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [users, searchTerm, companyFilter, sortOrder]);

  const totalPages = useMemo(() => {
    const computed = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
    return computed > 0 ? computed : 1;
  }, [processedUsers.length]);

  const clampedPage = useMemo(() => {
    return Math.min(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (clampedPage - 1) * ITEMS_PER_PAGE;
    return processedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [processedUsers, clampedPage]);

  const paginationSummary = useMemo(() => {
    if (isLoading) {
      return "Loading users...";
    }

    if (processedUsers.length === 0) {
      return "No users to display";
    }

    const rangeStart = (clampedPage - 1) * ITEMS_PER_PAGE + 1;
    const rangeEnd = Math.min(
      processedUsers.length,
      clampedPage * ITEMS_PER_PAGE
    );

    return `Showing ${rangeStart}-${rangeEnd} of ${processedUsers.length} users`;
  }, [clampedPage, processedUsers.length, isLoading]);

  const tableBody = (() => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Loading users...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-10 text-center text-sm text-red-600 dark:text-red-400"
          >
            Failed to load users.
            <div className="mt-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                Try again
              </button>
            </div>
          </td>
        </tr>
      );
    }

    if (paginatedUsers.length === 0) {
      return (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            No users match the current filters.
          </td>
        </tr>
      );
    }

    return paginatedUsers.map((user) => <UserRow key={user.id} user={user} />);
  })();

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            User Directory
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, filter, and manage your users with live data.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
          <div className="flex w-full flex-col gap-1.5 sm:w-64">
            <label
              htmlFor="user-search"
              className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400"
            >
              Search
            </label>
            <input
              id="user-search"
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40"
              autoComplete="off"
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Company
            </span>
            <Select.Root
              value={companyFilter}
              onValueChange={(value) => {
                setCompanyFilter(value);
                setCurrentPage(1);
              }}
            >
              <Select.Trigger
                aria-label="Filter by company"
                className="inline-flex h-10 min-w-[180px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-indigo-500/40"
              >
                <Select.Value placeholder="All companies">
                  {companyFilter === "all" ? "All companies" : companyFilter}
                </Select.Value>
                <Select.Icon>
                  <ChevronDownIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className="z-50 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  position="popper"
                  sideOffset={8}
                >
                  <Select.ScrollUpButton className="flex items-center justify-center bg-white py-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <ChevronUpIcon className="h-4 w-4" />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    <Select.Item
                      value="all"
                      className="relative flex select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-700 outline-none focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-700"
                    >
                      <Select.ItemIndicator className="absolute left-2 flex items-center">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                      <Select.ItemText>All companies</Select.ItemText>
                    </Select.Item>
                    {companies.map((company) => (
                      <Select.Item
                        key={company}
                        value={company}
                        className="relative flex select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-slate-700 outline-none focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-700"
                      >
                        <Select.ItemIndicator className="absolute left-2 flex items-center">
                          <CheckIcon className="h-4 w-4" />
                        </Select.ItemIndicator>
                        <Select.ItemText>{company}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center bg-white py-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <ChevronDownIcon className="h-4 w-4" />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div className="flex flex-col gap-1.5 sm:w-44">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Sort
            </span>
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="inline-flex h-10 flex-col justify-center rounded-lg border border-slate-200 bg-white px-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-indigo-500/40"
            >
              <span className="flex items-center justify-between gap-2">
                <span>Email</span>
                <ChevronDownIcon
                  className={`h-4 w-4 text-slate-500 transition-transform dark:text-slate-400 ${
                    sortOrder === "asc" ? "" : "rotate-180"
                  }`}
                />
              </span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                {sortOrder === "asc" ? "A to Z" : "Z to A"}
              </span>
            </button>
          </div>
          <div className="flex w-full items-end justify-end sm:w-auto sm:self-end">
            <AddUserDialog />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                Avatar
              </th>
              <th scope="col" className="px-4 py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-3">
                Email
              </th>
              <th scope="col" className="px-4 py-3">
                Phone
              </th>
              <th scope="col" className="px-4 py-3">
                Company
              </th>
              <th scope="col" className="px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tableBody}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <p>{paginationSummary}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={isLoading || currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={
              isLoading ||
              currentPage >= totalPages ||
              processedUsers.length === 0
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserTable;
