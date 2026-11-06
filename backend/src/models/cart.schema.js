
import z from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),

    quantity: z.number()
      .int()
      .positive()
      .default(1),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    quantity: z.number()
      .int()
      .positive(),
  }),
});
