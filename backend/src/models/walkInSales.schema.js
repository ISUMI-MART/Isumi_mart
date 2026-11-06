import { z } from "zod";

export const createWalkInSaleSchema = z.object({
  body: z.object({
    customerName: z.string().trim().max(100).optional().nullable(),

    paymentStatus: z
      .enum(["PENDING", "PAID", "FAILED"])
      .optional(),

    items: z
      .array(
        z.object({
          productId: z.number().int().positive(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, "At least one product is required"),
  }),
});