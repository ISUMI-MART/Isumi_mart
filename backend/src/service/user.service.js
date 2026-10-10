import "dotenv/config";
import { UserRepository } from "../repository/user.repository.js";
import { BadRequestError, NotFoundError } from "../errors/appError.js";


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



}