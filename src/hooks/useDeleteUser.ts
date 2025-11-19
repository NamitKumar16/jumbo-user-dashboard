"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/user";
import { deleteUser as deleteUserRequest } from "@/lib/api";
import { useUserManagementStore } from "@/store/useUserManagementStore";
import { addActivity } from "@/store/useActivityLog";

type Context = {
  previousUsers: User[];
  deletedUser?: User;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const addDeletedUser = useUserManagementStore(
    (state) => state.addDeletedUser
  );
  const usersQueryKey = ["users"] as const;

  return useMutation({
    mutationFn: async (id: number) => {
      return deleteUserRequest(id);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: usersQueryKey });

      const previousUsers =
        queryClient.getQueryData<User[]>(usersQueryKey) ?? [];
      const deletedUser = previousUsers.find((user) => user.id === id);

      queryClient.setQueryData<User[]>(usersQueryKey, (current = []) =>
        current.filter((user) => user.id !== id)
      );

      addDeletedUser(id);

      return { previousUsers, deletedUser };
    },
    onError: (_error, _id, context: Context | undefined) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(usersQueryKey, context.previousUsers);
      }
    },
    onSuccess: (_result, _id, context) => {
      if (context?.deletedUser) {
        addActivity({
          type: "DELETE",
          userId: context.deletedUser.id,
          userName: context.deletedUser.name,
          details: "Deleted user via confirmation",
        });
      }
    },
  });
};

export default useDeleteUser;

