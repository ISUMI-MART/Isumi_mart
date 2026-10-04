import { getAuth } from "@clerk/express";

export const requireAuth = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: You must sign in to access this resource.",
    });
  }

  req.clerkUserId = auth.userId;
  next();
};
