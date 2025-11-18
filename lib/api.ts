import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    Accept: "application/json",
  },
});

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
  return { id };
};
