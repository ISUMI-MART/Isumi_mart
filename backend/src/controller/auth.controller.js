import { AuthService } from "../service/auth.service.js";

const authService = new AuthService();

export class AuthController {
  register = async (req, res, next) => {
    try {
      console.log("Request body:", req.body);

      const user = await authService.register(req.body);
      

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
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

  login = async (req, res, next) => {
    try {
      const result = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      next(error);
    }
  };
}
