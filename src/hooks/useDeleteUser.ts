"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/user";
import { deleteUser as deleteUserRequest } from "@/lib/api";
import { useUserManagementStore } from "@/store/useUserManagementStore";

type Context = {
  previousUsers: User[];
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const addDeletedUser = useUserManagementStore(
    (state) => state.addDeletedUser
  );

  return useMutation({
    mutationFn: async (id: number) => {
      return deleteUserRequest(id);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];

      queryClient.setQueryData<User[]>(["users"], (current = []) =>
        current.filter((user) => user.id !== id)
      );

      addDeletedUser(id);

      return { previousUsers };
    },
    onError: (_error, _id, context: Context | undefined) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useDeleteUser;

