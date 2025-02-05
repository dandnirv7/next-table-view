import { PrismaClient } from "@prisma/client";
import { users } from "./utils/users";
import { hashPassword } from "./utils/hashPassword";

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);

    await prisma.users.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
