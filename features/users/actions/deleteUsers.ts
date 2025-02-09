import prisma from "@/lib/db";
import { selectOptions } from "../lib/users";

export async function deleteUsers(id: string) {
  try {
    const response = await prisma.users.delete({
      where: {
        id,
      },
      select: selectOptions,
    });

    if (!id) {
      throw new Error("Invalid ID");
    }

    console.log(response);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}
