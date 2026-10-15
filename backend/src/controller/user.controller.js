import { UserService } from "../service/user.service.js";
import { catchAsync } from "../util/catchAsync.js";



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
    const body = req.validated.body;

    const user = await userService.updateUser(userId, body);

    res.json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  });

  deleteProfile = catchAsync(
    async (req, res) => {
      const userId = req.currentUser.id;
      const deletedUser = await userService.deleteUser(userId);

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

   createDeliveryAgent = async (req, res, next) => {
    try {
      const user = await userService.createDeliveryAgent(req.body);

      return res.status(201).json({
        success: true,
        message: "Delivery Agent account created successfully",
        user,
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      }

      next(error);
    }
  };
}


