import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  q: parseAsString.withDefault(""),
  status: parseAsString,
  role: parseAsString,
  sortBy: parseAsString.withDefault("id"),
  sortOrder: parseAsString.withDefault("asc"),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
