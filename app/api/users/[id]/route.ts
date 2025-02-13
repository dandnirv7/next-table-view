import prisma from "@/lib/db";
import {
  handleCustomError,
  handleError,
  handleValidationError,
} from "@/utils/errorHandler";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { hashPassword } from "@/utils/hashPassword";
import sanitizeData from "@/utils/sanitize";
import { userSelect } from "@/utils/selectOptions";
import { NextResponse } from "next/server";
import { UserSchema } from "@/types/schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: userSelect,
    });

    if (!existingUser) {
      return handleCustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }

    return NextResponse.json(
      {
        success: true,
        data: existingUser,
        message: "User retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.PROCESS_FAILED);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const sanitizedData = sanitizeData(body, UserSchema.partial());

    const result = UserSchema.partial().safeParse(sanitizedData);

    if (!result.success) {
      return handleValidationError(result.error);
    }

    const validatedData = result.data;

    await prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.users.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingUser) {
        handleCustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }
    });

    const checkDuplicate = await prisma.users.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email },
        ],
        NOT: {
          id,
        },
        deletedAt: null,
      },
    });

    if (checkDuplicate) {
      handleCustomError(ERROR_MESSAGES.USERNAME_EMAIL_EXISTS, 409);
    }

    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }

    const updatedUser = await prisma.users.update({
      where: {
        id,
      },
      data: validatedData,
      select: userSelect,
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "User successfully update",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.UPDATE_FAILED);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await request.json();
    const sanitizedData = sanitizeData(body, UserSchema.partial());

    const result = UserSchema.partial().safeParse(sanitizedData);

    if (!result.success) {
      return handleValidationError(result.error);
    }

    const validatedData = result.data;

    await prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.users.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!existingUser) {
        handleCustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }
    });

    if (validatedData.email || validatedData.username) {
      const checkDuplicate = await prisma.users.findFirst({
        where: {
          OR: [
            validatedData.email ? { email: validatedData.email } : {},
            validatedData.username ? { username: validatedData.username } : {},
          ],
          NOT: {
            id,
          },
          deletedAt: null,
        },
      });

      if (checkDuplicate) {
        handleCustomError(ERROR_MESSAGES.USERNAME_EMAIL_EXISTS, 409);
      }
    }

    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: validatedData,
      select: userSelect,
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.UPDATE_FAILED);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const user = await prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.users.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      if (!existingUser) {
        handleCustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      return await prisma.users.delete({
        where: { id },
        select: {
          email: true,
          username: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.DELETE_FAILED);
  }
}
