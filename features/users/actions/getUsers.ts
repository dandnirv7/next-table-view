import prisma from "@/lib/db";
import { GetUsersResponse, User } from "../types/users";
import { selectOptions } from "../lib/users";

export async function getUsers(
  page: number = 1,
  perPage: number = 10,
  filters: Partial<User> = {},
  sortBy: keyof User = "id",
  sortOrder: "asc" | "desc" = "asc"
): Promise<GetUsersResponse> {
  const offset = (page - 1) * perPage;

  try {
    const users = await prisma.users.findMany({
      where: filters,
      select: selectOptions,
      skip: offset,
      take: perPage,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalUsers = await prisma.users.count({ where: filters });
    const total_pages = Math.ceil(totalUsers / perPage);

    return {
      status: "success",
      data: {
        users: users,
        limit: users.length,
        total_pages: total_pages,
        current_page: page,
        message: "Users fetched successfully",
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: "error",
      data: {
        users: [],
        limit: 0,
        total_pages: 0,
        current_page: 0,
        message: "Failed to fetch users",
      },
    };
  }
}
