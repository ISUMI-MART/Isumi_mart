
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository.js";

const userRepository = new UserRepository();

export class AuthService {
  async register({ email, userName, password, firstName, lastName }) {
    email = email.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      throw Object.assign(new Error("Enter a valid email"), {
        statusCode: 400,
      });
    }

    if (!userName?.trim()) {
      throw Object.assign(new Error("Username is required"), {
        statusCode: 400,
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      throw Object.assign(
        new Error("Password must be at least 8 characters"),
        { statusCode: 400 }
      );
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw Object.assign(new Error("Email is already registered"), {
        statusCode: 409,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.createUser({
      email,
      userName: userName.trim(),
      passwordHash,
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      role: "CUSTOMER",
    });

    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  async login({ email, password }) {
    if (typeof email !== "string" || typeof password !== "string") {
      throw Object.assign(new Error("Email and password are required"), {
        statusCode: 400,
      });
    }

    const user = await userRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (!user || !user.passwordHash) {
      throw Object.assign(new Error("Invalid email or password"), {
        statusCode: 401,
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw Object.assign(new Error("Invalid email or password"), {
        statusCode: 401,
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "10d" }
    );

    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }
}
