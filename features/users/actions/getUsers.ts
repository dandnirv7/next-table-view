import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { selectOptions } from "../lib/users";
import { GetUsersResponse, User } from "../types/users";

export async function getUsers(
  page: number = 1,
  perPage: number = 10,
  filters: Partial<User> = {},
  search: string = "",
  sortBy: keyof User = "id",
  sortOrder: "asc" | "desc" = "asc"
): Promise<GetUsersResponse> {
  page = Math.max(page, 1);

  const validStatus = ["active", "inactive"];
  if (filters.status && !validStatus.includes(filters.status)) {
    return {
      status: false,
      data: {
        users: [],
        limit: 0,
        total_users: 0,
        total_pages: 0,
        current_page: 0,
        message: `Invalid status value: ${filters.status}`,
      },
    };
  }

  const whereConditions: Prisma.UsersWhereInput = {
    AND: [
      filters.status ? { status: filters.status } : {},
      filters.role ? { role: filters.role } : {},
      filters.username
        ? { username: { contains: filters.username, mode: "insensitive" } }
        : {},
      search
        ? {
            OR: [
              { username: { contains: search, mode: "insensitive" } },
              { fullName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  try {
    const [totalUsers, users] = await Promise.all([
      prisma.users.count({ where: whereConditions }),
      prisma.users.findMany({
        where: whereConditions,
        select: selectOptions,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / perPage);
    const currentPage = page > totalPages ? totalPages : page;

    return {
      status: true,
      data: {
        users: users,
        limit: perPage,
        total_users: totalUsers,
        total_pages: totalPages,
        current_page: currentPage,
        message: "Users fetched successfully",
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: false,
      data: {
        users: [],
        limit: 0,
        total_users: 0,
        total_pages: 0,
        current_page: 0,
        message: `Failed to fetch users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
    };
  }
}
