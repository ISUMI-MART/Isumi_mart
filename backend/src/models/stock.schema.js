
import z from "zod";

const positiveId = z.coerce
    .number()
    .int("ID must be an integer.")
    .positive("ID must be a positive integer.");

export const createStockSchema = z.object({
    body: z.object({
        productId: positiveId,

        quantity: z.coerce
            .number()
            .int("Quantity must be an integer.")
            .min(0, "Quantity cannot be negative.")
            .optional()
            .default(0),

        lowStockThreshold: z.coerce
            .number()
            .int()
            .min(0, "Threshold cannot be negative.")
            .optional()
            .default(5),

        reorderQuantity: z.coerce
            .number()
            .int()
            .positive("Reorder quantity must be greater than 0.")
            .optional()
            .default(50)
    })
});

export const stockIdParamSchema = z.object({
    params: z.object({
        id: positiveId
    })
});

export const updateStockSchema = z.object({
    params: z.object({
        id: positiveId
    }),

    body: z.object({
        quantity: z.coerce
            .number()
            .int()
            .min(0, "Quantity cannot be negative.")
            .optional(),

        lowStockThreshold: z.coerce
            .number()
            .int()
            .min(0, "Threshold cannot be negative.")
            .optional(),

        reorderQuantity: z.coerce
            .number()
            .int()
            .positive("Reorder quantity must be greater than 0.")
            .optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required to update stock."
        }
    )
});
