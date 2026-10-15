import "dotenv/config";
import bcrypt from "bcryptjs";
import { UserRepository } from "../repository/user.repository.js";
import { NotFoundError } from "../errors/appError.js";


const userRepository = new UserRepository();

export class UserService {

  async createUserProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }


  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("Not Found")
    }
    return user
  }

  async updateUser(userId, data) {
    const updatedUser = await userRepository.findById(userId);

    if (!updatedUser) {
      throw new NotFoundError("User Not Found")
    }
    return await userRepository.updateUser(userId, data)
  }

  async deleteUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found")
    }
    return await userRepository.deleteUser(userId)

  }
async createDeliveryAgent({
    email,
    userName,
    password,
    firstName,
    lastName,
  }) {
   
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      throw new BadRequestError("Enter a valid email");
    }

    email = email.trim().toLowerCase();

    if (typeof userName !== "string" || !userName.trim()) {
      throw new BadRequestError("Username is required");
    }

    if (typeof password !== "string" || password.length < 8) {
      throw new BadRequestError(
        "Password must be at least 8 characters"
      );
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      return await userRepository.createUser({
        email,
        userName: userName.trim(),
        passwordHash,
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        role: "DELIVERY_AGENT",
      });
    } catch (error) {

      if (error.code === "P2002") {
        throw new ConflictError(
          "Email is already registered"
        );
      }

      throw error;
    }
  }
}
