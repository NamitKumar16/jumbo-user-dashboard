"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useActivityStore } from "@/store/useActivityLog";
import * as Switch from "@radix-ui/react-switch";

const ActivityIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16v16H4z" />
    <path d="M8 9h8" />
    <path d="M8 13h5" />
    <path d="M8 17h3" />
  </svg>
);

export default function Navbar() {
  const { loggedInUser } = useUserStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const activityCount = useActivityStore((state) => state.activities.length);
  const toggleActivityLog = useActivityStore((state) => state.toggleOpen);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Left Logo */}
      <h1 className="text-xl font-bold dark:text-white">Jumbo Dashboard</h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleActivityLog}
          aria-label="Toggle activity log"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
        >
          <ActivityIcon />
          <span>Activity Log ({isHydrated ? activityCount : "–"})</span>
        </button>

        {/* Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm dark:text-gray-300">Dark Mode</span>

          <Switch.Root
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            className="
              w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative 
              data-[state=checked]:bg-blue-600 transition-colors
            "
          >
            <Switch.Thumb
              className="
                block w-5 h-5 bg-white rounded-full shadow 
                translate-x-1 data-[state=checked]:translate-x-6 
                transition-transform
              "
            />
          </Switch.Root>
        </div>

        {/* Logged-in User */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {loggedInUser.initials}
          </div>

          {/* Name */}
          <span className="font-medium dark:text-gray-200">
            {loggedInUser.name}
          </span>
        </div>
      </div>
    </nav>
  );
}
