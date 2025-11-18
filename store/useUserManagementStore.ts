import { create } from "zustand";

type UserManagementState = {
  deletedUserIds: number[];
  addDeletedUser: (id: number) => void;
};

export const useUserManagementStore = create<UserManagementState>((set) => ({
  deletedUserIds: [],
  addDeletedUser: (id) =>
    set((state) => ({
      deletedUserIds: state.deletedUserIds.includes(id)
        ? state.deletedUserIds
        : [...state.deletedUserIds, id],
    })),
}));

