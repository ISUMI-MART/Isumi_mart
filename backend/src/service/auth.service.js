
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../errors/appError.js";

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
      throw new BadRequestError("Username is required")
    }

    if (typeof password !== "string" || password.length < 8) {
      throw new BadRequestError("Password must be at least 8 characters")
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("Email is already registered");
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
      throw new BadRequestError("Email and password are required")
    }

    const user = await userRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError("Invalid email or password")
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid email or password")
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
