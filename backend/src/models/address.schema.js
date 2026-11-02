import z from "zod";

export const createAddressSchema = z.object({
    body: z.object({

        phone: z.string()

            .trim()
            .min(9, "Phone number is too short.")
            .max(15, "Phone number is too long.")
            .optional(),


        street: z.string()
            .trim()
            .min(5, "Address is required.")
            .max(200),

        area: z.string()
            .trim()
            .min(5, "Address is required.")
            .max(200),

        city: z.string()
            .trim()
            .min(2, "City is required.")
            .max(100),

        postalCode: z.string()
            .trim()
            .max(10)
            .optional()
            .nullable(),

        isDefault: z.boolean().optional().default(false)
    })
});

export const addressIdParamSchema = z.object({
    params: z.object({
        id: z.string().transform((val, ctx) => {
            const parsed = Number(val);

            if (!Number.isInteger(parsed) || parsed <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Address ID must be a positive integer."
                });

                return z.NEVER;
            }

            return parsed;
        })
    })
});

export const updateAddressSchema = z.object({
    params: addressIdParamSchema.shape.params,

    body: z.object({
        phone: z.string().trim().min(9).max(15).optional(),
        street: z.string().trim().min(5).max(200).optional(),
        area: z.string().trim().min(5).max(200).optional(),
        city: z.string().trim().min(2).max(100).optional(),
        postalCode: z.string().trim().max(10).nullable().optional(),
        isDefault: z.boolean().optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required to update an address."
        }
    )
});