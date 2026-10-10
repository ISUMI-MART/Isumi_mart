import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository.js";

const userRepository = new UserRepository();

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  const token = authHeader.substring(7);

  let payload;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  if (
    typeof payload !== "object" ||
    !payload ||
    !Number.isInteger(payload.userId)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid token payload.",
    });
  }

  try {
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    const { passwordHash, ...safeUser } = user;

    req.currentUser = safeUser;

    next();
  } catch (error) {
    next(error);
  }
};
