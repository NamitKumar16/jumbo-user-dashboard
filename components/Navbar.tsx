"use client";

import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import * as Switch from "@radix-ui/react-switch";

export default function Navbar() {
  const { loggedInUser } = useUserStore();
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Left Logo */}
      <h1 className="text-xl font-bold dark:text-white">Jumbo Dashboard</h1>

      {/* Right side */}
      <div className="flex items-center gap-6">
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
