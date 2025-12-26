import { prisma } from '../src/config/prisma';
import {hashPassword} from '../src/utils/hashPassword';

async function main() {
  const password = await hashPassword("yudha123");
  await prisma.user.create({
    data: {
      name: "Yudha Frebian",
      email: "Hw0yP@example.com",
      password: password,
      role: "ADMIN"
    }
  });

  console.log("Seeder successfully run");
}

main()
  .catch((e) => {
    console.error("Seeder error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
