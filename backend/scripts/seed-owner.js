
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/Prisma.js";

async function createOwner() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  const userName = process.env.OWNER_USERNAME?.trim();

  if (!email || !password || !userName) {
    throw new Error(
      "Set OWNER_EMAIL, OWNER_PASSWORD and OWNER_USERNAME first."
    );
  }

  if (password.length < 8) {
    throw new Error("Owner password must be at least 8 characters.");
  }


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error(
      "This email already exists. No account was changed."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await prisma.user.create({
    data: {
      email,
      userName,
      passwordHash,
      firstName: "Isumi",
      lastName: "Owner",
      role: "OWNER",
    },
    select: {
      id: true,
      email: true,
      userName: true,
      role: true,
    },
  });

  console.log("Owner account created successfully!");
  console.log(owner);
}

try {
  await createOwner();
} catch (error) {
  console.error("Could not create Owner:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
