"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { AppUserListParams } from "@/services/users";
import { appUsersStore } from "@/stores/use-app-users.store";

export function useAppUsers(
  params: AppUserListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(appUsersStore, params, options);
}

export function useAllAppUsers(options?: { enabled?: boolean }) {
  return useResourceAll(appUsersStore, options);
}
