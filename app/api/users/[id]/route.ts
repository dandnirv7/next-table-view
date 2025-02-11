import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

export async function handler(request: Request, { params }: Params) {
  const id = params.id;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    switch (request.method) {
      case "DELETE": {
        const userExist = await prisma.users.findUnique({
          where: { id },
        });

        if (!userExist) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const userDelete = await prisma.users.delete({
          where: { id },
        });

        return NextResponse.json(
          { message: "User deleted successfully", user: userDelete },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: "Method Not Allowed" },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export { handler as DELETE };
