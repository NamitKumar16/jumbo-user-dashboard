import { create } from "zustand";
import type { User } from "@/types/user";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

type FormBridge = {
  setValues: (values: FormValues) => void;
  resetValues: () => void;
};

type UserModalState = {
  isModalOpen: boolean;
  isEditMode: boolean;
  userBeingEdited: User | null;
  formBridge: FormBridge | null;
  openForCreate: () => void;
  openForEdit: (user: User) => void;
  closeModal: () => void;
  registerFormBridge: (bridge: FormBridge | null) => void;
};

export const useUserModalStore = create<UserModalState>((set, get) => ({
  isModalOpen: false,
  isEditMode: false,
  userBeingEdited: null,
  formBridge: null,
  openForCreate: () => {
    get().formBridge?.resetValues();
    set({
      isModalOpen: true,
      isEditMode: false,
      userBeingEdited: null,
    });
  },
  openForEdit: (user) => {
    get().formBridge?.setValues({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      company: user.company?.name ?? "",
    });
    set({
      isModalOpen: true,
      isEditMode: true,
      userBeingEdited: user,
    });
  },
  closeModal: () => {
    get().formBridge?.resetValues();
    set({
      isModalOpen: false,
      isEditMode: false,
      userBeingEdited: null,
    });
  },
  registerFormBridge: (bridge) => set({ formBridge: bridge }),
}));

