"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import type { User } from "@/types/user";

type AddUserDialogProps = {
  onUserCreated?: (user: User) => void;
  onClose?: () => void;
};

const overlayStyles =
  "fixed inset-0 bg-slate-900/30 backdrop-blur-sm dark:bg-black/60";
const contentStyles =
  "fixed left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none dark:border-slate-800 dark:bg-slate-900";
const labelStyles =
  "text-xs font-semibold uppercase text-slate-500 dark:text-slate-400";
const inputStyles =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/40";

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            company: {
              name: company,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      return response.json();
    },
    onSuccess: () => {
      resetForm();
      setOpen(false);
      onClose?.();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetForm();
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          + Add User
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={overlayStyles} />
        <Dialog.Content className={contentStyles}>
          <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            Add a new user
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Provide the basic details below. Functionality will be added later.
          </Dialog.Description>

          <form
            id="add-user-form"
            className="mt-5 space-y-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="space-y-1">
              <label htmlFor="name" className={labelStyles}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                className={inputStyles}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className={labelStyles}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                className={inputStyles}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className={labelStyles}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                autoComplete="tel"
                className={inputStyles}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="company" className={labelStyles}>
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Acme Inc."
                autoComplete="organization"
                className={inputStyles}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>
          </form>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-indigo-500/40"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="submit"
              form="add-user-form"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>

          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddUserDialog;
