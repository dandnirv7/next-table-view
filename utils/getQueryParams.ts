import { FilterParams, User } from "@/types/user";

export function getQueryParams(searchParams: URLSearchParams): FilterParams {
  const searchParamsCache = new Map<string, string | undefined>();

  searchParams.forEach((value, key) => {
    searchParamsCache.set(key, value);
  });

  return {
    status:
      (searchParamsCache.get("status") as "active" | "inactive" | undefined) ||
      undefined,
    role: searchParamsCache.get("role") || undefined,
    sortBy: (searchParamsCache.get("sortBy") as keyof User | undefined) || "id",
    sortOrder: (searchParamsCache.get("sortOrder") as "asc" | "desc") || "asc",
    search: searchParamsCache.get("q") || "",
    page: parseInt(searchParamsCache.get("page") || "1", 10),
    limit: parseInt(searchParamsCache.get("limit") || "10", 10),
  };
}
