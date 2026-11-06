
import z from "zod";

export const createStockMovementSchema = z.object({
  body: z.object({

    productId: z.number()
      .int()
      .positive(),

    quantity: z.number()
      .int()
      .refine((value) => value !== 0, {
        message: "Quantity cannot be zero",
      }),

    note: z.string()
      .trim()
      .max(255, "Note cannot exceed 255 characters")
      .optional(),
  }),
});
