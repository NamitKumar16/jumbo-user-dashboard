import { create } from "zustand";

interface UserState {
  loggedInUser: {
    name: string;
    initials: string;
  };
  setLoggedInUser: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  loggedInUser: {
    name: "John Doe",
    initials: "JD",
  },

  setLoggedInUser: (name) =>
    set(() => ({
      loggedInUser: {
        name,
        initials: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      },
    })),
}));
