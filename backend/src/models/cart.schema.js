
import z from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),

    quantity: z.number()
      .positive("Quantity must be greater than 0")
      .default(1),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    quantity: z.number()
      .positive("Quantity must be greater than 0"),
  }),
});
