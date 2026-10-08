import { UserService } from "../service/user.service.js";
import { catchAsync } from "../util/catchAsync.js";
import { clerkClient } from "@clerk/express";


const userService = new UserService();

export class UserController {
  getProfile = catchAsync(
    async (req, res) => {
      const userId = req.currentUser.id;
      const user = await userService.getUserProfile(userId);

      if (!user) {
        throw new Error("User profile not found");
      }

      res.json({
        success: true,
        message: "User profile retrieved successfully",
        user,
      });
    },
  );

  updateProfile = catchAsync(async (req, res) => {
    const userId = req.currentUser.id;
    const clerkId = req.currentUser.clerkId;
    const body = req.validated.body;

    const user = await userService.updateUser(userId, body);
    await clerkClient.users.updateUser(clerkId, {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.userName,
    });

    res.json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  });

  deleteProfile = catchAsync(
    async (req, res) => {
      const userId = req.currentUser.id;
      const clerkId = req.currentUser.clerkId;
      const deletedUser = await userService.deleteUser(userId);
      await clerkClient.users.deleteUser(clerkId);

      if (!deletedUser) {
        throw new Error("User profile not found");
      }

      res.json({
        success: true,
        message: "User profile delete successfully",
        user: deletedUser,
      });
    },
  );

}
