import z from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        deliveryFullName: z.string().trim().min(3, "Name is too short.").max(100),
        deliveryAddress: z.string().trim().min(5, "Address is required.").max(300),
        area: z.string().trim().min(2, "Area is required.").max(100),
        phoneNumber: z.string()
            .trim()
            .min(9, "Phone number is too short.")
            .max(15, "Phone number is too long."),
        deliveryNote: z.string().trim().optional().nullable(),

        // Order amounts
        subtotal: z.number().positive("Subtotal must be positive."),
        deliveryFee: z.number().nonnegative().default(0),
        discount: z.number().nonnegative().default(0),
        totalAmount: z.number().positive("Total amount must be positive."),

        // Order Items (Array of items)
        items: z.array(
            z.object({
                productId: z.number().int().positive("Invalid Product ID."),
                quantity: z.number().int().positive("Quantity must be at least 1."),
                price: z.number().positive("Price must be positive.")
            })
        ).min(1, "Order must have at least one item.")
    })
});

// updating the Order Status (PATCH)
export const updateOrderStatusSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order ID is required.") 
    }),
    body: z.object({
        status: z.enum([
            'ORDER_PLACED', 'CONFIRMED', 'PREPARING', 'ASSIGNED', 
            'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'CANCELLED'
        ])
    })
});

// Validates Order 
export const orderIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order ID is required.")
    })
});