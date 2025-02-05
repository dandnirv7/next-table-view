import { faker } from "@faker-js/faker";
import { Users } from "@prisma/client";

export const users: Users[] = Array.from({ length: 20 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    fullName: `${firstName} ${lastName}`,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    password: `${firstName}123`,
    status: faker.helpers.arrayElement(["active", "inactive"]),
    role: faker.helpers.arrayElement(["superadmin", "admin", "user"]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  };
});
