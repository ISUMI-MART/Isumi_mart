import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  throw new Error("CLERK_SECRET_KEY is not configured.");
}

const clerkClient = createClerkClient({
  secretKey: clerkSecretKey,
});

const userRepository = new UserRepository();

export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {

      const clerkId = req.clerkId;

      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required.",
        });
      }

      
      let currentUser = await userRepository.findByClerkId(clerkId);

      if (!currentUser) {
        console.log(
          `User ${clerkId} not found in database. Syncing from Clerk...`
        );

        const clerkUser = await clerkClient.users.getUser(clerkId);

        const email =
          clerkUser.primaryEmailAddress?.emailAddress ||
          clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
          return res.status(400).json({
            success: false,
            message: "Clerk account does not have a valid email address.",
          });
        }

        const userData = {
          clerkId: clerkUser.id,
          email,
          userName:
            clerkUser.username ||
            email.split("@")[0],
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          role: "CUSTOMER",
        };

        currentUser = await userRepository.createUser(userData);

        console.log(
          `Successfully synced user to DB with ID: ${currentUser.id}`
        );
      }

     
      if (!allowedRoles.includes(currentUser.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to perform this action.",
        });
      }

     
      req.currentUser = currentUser;

      next();
    } catch (error) {
      console.error("Role authorization failed:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error during authorization.",
      });
    }
  };
}
