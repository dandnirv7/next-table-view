import prisma from "@/lib/db";
import { GetUsersResponse } from "@/types/user";
import { getQueryParams } from "@/utils/getQueryParams";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const {
      page = 1,
      limit = 10,
      search,
      status,
      role,
      sortBy,
      sortOrder = "asc",
    } = getQueryParams(searchParams);

    if (
      isNaN(page as number) ||
      page < 1 ||
      isNaN(limit as number) ||
      limit < 1
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const whereCondition: Prisma.UsersWhereInput = {
      deletedAt: null,
      AND: [
        status ? { status: status } : {},
        role ? { role: role } : {},
        search
          ? {
              OR: [
                {
                  username: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  fullName: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
      ],
    };

    const [totalUsers, users] = await Promise.all([
      prisma.users.count({ where: whereCondition }),
      prisma.users.findMany({
        where: whereCondition,
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          role: true,
          status: true,
        },
        skip: offset,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);
    const currentPage = page > totalPages ? totalPages : page;

    const response: GetUsersResponse = {
      status: "success",
      data: {
        users: users,
        limit,
        total_users: totalUsers,
        total_pages: totalPages,
        current_page: currentPage,
        message: "Users retrieved successfully",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}
