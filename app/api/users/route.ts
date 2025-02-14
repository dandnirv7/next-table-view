import prisma from "@/lib/db";
import { UserData, UserSchema } from "@/types/schema";
import { GetUsersResponse } from "@/types/user";
import {
  handleCustomError,
  handleError,
  handleValidationError,
} from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { getQueryParams } from "@/utils/getQueryParams";
import { hashPassword } from "@/utils/hashPassword";
import sanitizeData from "@/utils/sanitize";
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

export async function POST(request: Request) {
  try {
    const body: UserData = await request.json();
    const validatedData = sanitizeData(body, UserSchema);

    const result = UserSchema.safeParse(validatedData);

    if (!result.success) {
      return handleValidationError(result.error);
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username: validatedData.username,
          },
          {
            email: validatedData.email,
          },
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      return handleCustomError(ERROR_MESSAGES.USERNAME_EMAIL_EXISTS, 409);
    }

    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }

    const user = await prisma.users.create({
      data: {
        ...validatedData,
        role: validatedData.role || "user",
        status: "active",
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.CREATE_FAILED);
  }
}
