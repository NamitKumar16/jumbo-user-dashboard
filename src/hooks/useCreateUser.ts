"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "@/types/user";

const endpoint = "https://jsonplaceholder.typicode.com/users";

export type CreateUserInput = {
  name: string;
  email: string;
  phone?: string;
  company?: {
    name?: string;
  };
};

const buildUser = (input: CreateUserInput, id: number): User => ({
  id,
  name: input.name.trim(),
  email: input.email.trim(),
  phone: input.phone?.trim() ?? "",
  company: {
    name: input.company?.name?.trim() || "N/A",
  },
  address: {
    street: "",
    city: "",
    zipcode: "",
  },
});

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateUserInput) => {
      const response = await axios.post(endpoint, payload);
      const data = response.data ?? {};
      const fallbackId =
        typeof data.id === "number"
          ? data.id
          : Math.floor(Math.random() * 1_000_000) + Date.now();

      return buildUser(payload, fallbackId);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]) ?? [];

      const temporaryId = Date.now();
      const optimisticUser = buildUser(payload, temporaryId);

      queryClient.setQueryData<User[]>(["users"], (current = []) => [
        optimisticUser,
        ...current,
      ]);

      return { previousUsers, temporaryId };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData<User[]>(["users"], context.previousUsers);
      }
    },
    onSuccess: (createdUser, _payload, context) => {
      queryClient.setQueryData<User[]>(["users"], (current = []) =>
        current.map((user) =>
          user.id === context?.temporaryId ? createdUser : user
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

export default useCreateUser;

