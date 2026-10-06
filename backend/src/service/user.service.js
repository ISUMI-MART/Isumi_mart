import "dotenv/config"; 
import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";
import { BadRequestError, NotFoundError } from "../errors/appError.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const userRepository = new UserRepository();

export class UserService {
  async findOrCreateLocalUser(clerkId) {
    
    let localUser = await userRepository.findByClerkId(clerkId);

    
    if (!localUser) {
      
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new BadRequestError("Clerk user account profiles must maintain a valid primary email address.");
      }

      const userData = {
        clerkId: clerkUser.id,
        email: email,
      };

      if (clerkUser.firstName) userData.firstName = clerkUser.firstName;
      if (clerkUser.lastName) userData.lastName = clerkUser.lastName;

      localUser = await userRepository.createUser(userData);
    }
      return localUser;
    }

      async createUserProfile(userId) {
     const user = await userRepository.findById(userId);

     if(!user){
      throw new NotFoundError("Not Found")
     }
     return user
  }
    
  async getUserProfile(userId) {
     const user = await userRepository.findById(userId);

     if(!user){
      throw new NotFoundError("Not Found")
     }
     return user
  }

  async updateUserProfile(userId) {
    const updatedUser  = await userRepository.findById(userId);

    if(!updatedUser ){
      throw new NotFoundError("User Not Found")
    } 
    return await userRepository.updateUser(userId,data)
  }

  async deleteUser(userId) {
    const user = await userRepository.findById(userId);

    if(!user){
      throw new NotFoundError("User not found")
    }
    return await userRepository.deleteUser(userId)

  }


    
}