import { create } from "zustand";

const STORAGE_KEY = "jumbo_activity_log_v1";

export type ActivityType = "ADD" | "EDIT" | "DELETE" | "VIEW";

export type Activity = {
  id: string;
  type: ActivityType;
  userId?: number;
  userName?: string;
  timestamp: string;
  details?: string;
};

type ActivityState = {
  activities: Activity[];
  isOpen: boolean;
  addActivity: (
    activity: Omit<Activity, "id" | "timestamp">
  ) => void;
  clearActivities: () => void;
  toggleOpen: () => void;
};

const loadInitialActivities = (): Activity[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: loadInitialActivities(),
  isOpen: true,

  addActivity: (activity) => {
    const newEntry: Activity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...get().activities];

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    }

    set({ activities: updated });
  },

  clearActivities: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ activities: [] });
  },
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const addActivity = (
  activity: Parameters<ActivityState["addActivity"]>[0]
) => useActivityStore.getState().addActivity(activity);

export const clearActivities = () => useActivityStore.getState().clearActivities();
