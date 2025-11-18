"use client";

import React from "react";
import { useActivityStore } from "@/store/useActivityLog";

const typeStyles: Record<
  "ADD" | "EDIT" | "DELETE",
  { badge: string; label: string }
> = {
  ADD: {
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    label: "Added",
  },
  EDIT: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    label: "Edited",
  },
  DELETE: {
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    label: "Deleted",
  },
};

const ActivityLogSidebar: React.FC = () => {
  const activities = useActivityStore((state) => state.activities);
  const clearActivities = useActivityStore((state) => state.clearActivities);
  const isOpen = useActivityStore((state) => state.isOpen);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isOpen || !isHydrated) {
    return null;
  }

  const renderList = () => {
    if (activities.length === 0) {
      return (
        <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Activity log is empty. Actions you take will appear here.
        </p>
      );
    }

    return (
      <ul className="space-y-4">
        {activities.map((activity) => {
          const styles = typeStyles[
            activity.type as keyof typeof typeStyles
          ] ?? {
            badge:
              "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
            label: activity.type ?? "Activity",
          };
          const timestamp = new Date(activity.timestamp).toLocaleString();

          return (
            <li
              key={activity.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${styles.badge}`}
                >
                  {styles.label}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {timestamp}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {activity.userName ?? "Unknown user"}
                  {activity.userId ? (
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{`  (#${activity.userId})`}</span>
                  ) : null}
                </p>
                {activity.details ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {activity.details}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Activity Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tracking your recent actions
          </p>
        </div>
        <button
          type="button"
          aria-label="Clear activity log"
          onClick={clearActivities}
          className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 space-y-4">{renderList()}</div>
    </>
  );

  return (
    <>
      <aside className="hidden h-fit min-h-[200px] w-full max-w-xs flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex">
        {content}
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 block rounded-t-3xl border-t border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:hidden">
        {content}
      </div>
    </>
  );
};

export default ActivityLogSidebar;
