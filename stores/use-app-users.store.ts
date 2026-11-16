"use client";

import { getAllAppUsers } from "@/services/users";
import type { AppUser, AppUserListParams } from "@/services/users";
import { createResourceStore } from "@/stores/create-resource-store";

export const appUsersStore = createResourceStore<AppUser, AppUserListParams>({
  fetchPage: getAllAppUsers,
  errorMessage: "Não foi possível carregar os utilizadores.",
});
