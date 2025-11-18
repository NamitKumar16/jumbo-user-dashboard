import { create } from "zustand";

interface LogEntry {
  message: string;
  timestamp: string;
}

interface LogState {
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useActivityLog = create<LogState>((set) => ({
  logs: [],

  addLog: (message) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          message,
          timestamp: new Date().toLocaleString(),
        },
      ],
    })),

  clearLogs: () => set({ logs: [] }),
}));
