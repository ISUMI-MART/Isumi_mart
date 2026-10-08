import z from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().trim().max(20).optional(),
    lastName: z.string().trim().max(20).optional(),
    userName: z
      .string()
      .min(2, "Username must be at least 2 characters long.")
      .max(30, "Username cannot exceed 30 characters.")
      .trim()
      .optional(),
      phone: z.
      string()
      .trim()
      .max(10, "Phon should contain 10 numbers")
      .optional(),
      address: z.string().trim().max(100).optional(),

  }),
});
