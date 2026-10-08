import { verifyToken } from "@clerk/backend";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Bearer token is required.",
      });
    }

    const token = authHeader.substring(7);

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid Clerk token.",
      });
    }

    req.clerkId = payload.sub;
    next();
  } catch (error) {
    console.error("Clerk token verification failed:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired Clerk token.",
    });
  }
};