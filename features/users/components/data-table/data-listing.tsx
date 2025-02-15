import { searchParamsCache } from "@/lib/search-params";
import { User } from "@/types/user";
import { getUsers } from "../../actions/getUsers";
import { DataTable } from "../data-table";
import { columns } from "./columns";

export default async function DataListing({}) {
  const page = searchParamsCache.get("page") || 1;
  const pageLimit = searchParamsCache.get("limit");
  const search = searchParamsCache.get("q") || "";
  const status =
    (searchParamsCache.get("status") as "active" | "inactive" | undefined) ||
    undefined;
  const role = searchParamsCache.get("role") || "";
  const sortBy =
    (searchParamsCache.get("sortBy") as keyof User | undefined) || "id";
  const sortOrder =
    (searchParamsCache.get("sortOrder") as "asc" | "desc") || "asc";

  const filters = {
    status,
    role,
    sortBy,
    sortOrder,
    ...(search && { search }),
  };

  const { data } = await getUsers(page, pageLimit, filters, search);

  const users: User[] = data.users || [];
  const totalUsers = data.total_users;

  return <DataTable columns={columns} data={users} totalItems={totalUsers} />;
}
