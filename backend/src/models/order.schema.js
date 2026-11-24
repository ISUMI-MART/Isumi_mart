import z from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    deliveryFullName: z.string().trim().min(3, "Name is too short.").max(100),
    deliveryAddress: z.string().trim().min(5, "Address is required.").max(300),
    area: z.string().trim().min(2, "Area is required.").max(100),
    phoneNumber: z
      .string()
      .trim()
      .min(9, "Phone number is too short.")
      .max(15, "Phone number is too long."),
    deliveryNote: z.string().trim().optional().nullable(),

    //Order Items (Array of items)
    items: z
      .array(
        z.object({
          productId: z.number().int().positive("Invalid Product ID."),
          quantity: z.number().positive("Quantity must be greater than 0."),
          //price: z.number().positive("Price must be positive.")
        }),
      )
      .min(1, "Order must have at least one item.")
      .superRefine((items, ctx) => {
        const ids = items.map((item) => item.productId);
        const uniqueIds = new Set(ids);
        if (uniqueIds.size != ids.length) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate products are not allowed",
          });
        }
      }),
  }),
});

// updating the Order Status (PATCH)

export const updateOrderStatusSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Order ID is required."),
    }),

    body: z.object({
        status: z.enum([
            "ORDER_PLACED",
            "CONFIRMED",
            "PREPARING",
            "ASSIGNED",
            "PICKED_UP",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "DELIVERY_FAILED",
            "CANCELLED",
        ]),

        deliveryFailureReason: z.string()
            .trim()
            .min(2, "Please select a delivery failure reason.")
            .max(100)
            .optional(),

        deliveryFailureNote: z.string()
            .trim()
            .max(500, "Note must be 500 characters or less.")
            .nullable()
            .optional(),
    }).superRefine((data, ctx) => {
        if (
            data.status === "DELIVERY_FAILED" &&
            !data.deliveryFailureReason
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["deliveryFailureReason"],
                message: "A delivery failure reason is required.",
            });
        }
    }),
});


// Validates Order
export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required."),
  }),
});

export const assignDeliveryAgentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required."),
  }),

  body: z.object({
    deliveryAgentId: z.number().int().positive("Invalid delivery agent ID."),
  }),
});
