"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const darkMode = useThemeStore((state) => state.darkMode);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode, isHydrated]);

  return <>{children}</>;
};

export default ThemeProvider;
