import z from "zod";

//Validation schema for creating an Order Item
export const createOrderItemSchema = z.object({
    body: z.object({
        orderId: z.string().min(1, "Order ID is required."),
        productId: z.number().int().positive("Invalid Product ID."),
        quantity: z.number().int().positive("Quantity must be at least 1."),
        price: z.number().positive("Price must be positive.")
    })
});

//Validation schema for updating an Order Item
export const updateOrderItemSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order Item ID is required.")
    }),
    body: z.object({
        quantity: z.number().int().positive("Quantity must be at least 1.").optional(),
        price: z.number().positive("Price must be positive.").optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field is required to update." }
    )
});