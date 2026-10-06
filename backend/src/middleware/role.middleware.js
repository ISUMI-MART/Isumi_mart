import { createClerkClient } from "@clerk/express";
import { UserRepository } from "../repository/user.repository.js";

const userRepository = new UserRepository
const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || "",
});

export function requireRole(...allowedRoles) {
    return async (req, res, next) => {
        try {
            const clerkId = req.clerkId;

            if (!clerkId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Missing authentication context.",
                });
            }

            let localuser = await userRepository.findByClerkId(clerkId)

            if (!localuser) {
                console.log(`User ${clerkId} not found in database. Initiating safe emergency sync...`);

                const clerkUser = await clerkClient.users.getUser(clerkId);
                const email = clerkUser.emailAddresses[0]?.emailAddress;

                if (!email) {
                    return res.status(400).json({
                        success: false,
                        message: "Authentication failed: Clerk account lacks a valid email address.",
                    });
                }

                const userData = {
                    clerkId: clerkUser.id,
                    email: email,
                    userName: clerkUser.username || email.split("@")[0],
                    firstName: clerkUser.firstName || null,
                    lastName: clerkUser.lastName || null,
                    role: "CUSTOMER",
                };
                if (clerkUser.firstName) {
                    userData.firstName = clerkUser.firstName;
                }
                if (clerkUser.lastName) {
                    userData.lastName = clerkUser.lastName;
                }
                localuser = await userRepository.upsertUserByClerkId(clerkId, userData);
                console.log(`Successfully synced user to DB with ID: ${localuser.id}`);
            }

            if (!allowedRoles.includes(localuser.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission to perform this action.",
                });
            }

            req.currentUser = localuser;
            next();
        } catch (error) {
            console.error("Critical error inside requireRole middleware:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during authorization verification.",
            });
        }
    };
}
