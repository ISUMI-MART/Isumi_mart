import z from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Product name is required." })
      .min(2, "Product name must be at least 2 characters long.")
      .max(100, "Product name cannot exceed 100 characters.")
      .trim(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters.")
      .trim()
      .optional()
      .nullable(),

    price: z
      .coerce
      .number({ message: "Product price is required." })
      .positive("Price must be greater than 0.")
      .max(99999999.99, "Price is too large.")
      .refine(
        (value) => Number.isFinite(value) &&
          Math.round(value * 100) === value * 100,
        "Price can have a maximum of 2 decimal places."
      ),

    imageUrl: z
      .string()
      .trim()
      .url("Please provide a valid image URL.")
      .optional()
      .nullable(),

    unit: z
      .string({ message: "Product unit is required." })
      .trim()
      .min(1, "Product unit cannot be empty.")
      .max(30, "Product unit cannot exceed 30 characters."),
      categorySlug: z.string().min(1, "Category slug is required")
  }),
});


export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) =>
        Math.max(1, parseInt(val, 10) || 1)
      ),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) =>
        Math.min(50, Math.max(1, parseInt(val, 10) || 10))
      ),

    sortBy: z
      .enum(["name", "price", "createdAt", "updatedAt"])
      .optional()
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .default("desc"),

    search: z
      .string()
      .trim()
      .optional(),

    categoryId: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined || val === "") {
          return undefined;
        }

        const parsed = Number(val);

        return Number.isInteger(parsed) && parsed > 0
          ? parsed
          : undefined;
      }),
  }),
});


export const productIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val, ctx) => {
        const parsed = Number(val);

        if (!Number.isInteger(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: "custom",
            message: "Product ID must be a positive integer.",
          });

          return z.NEVER;
        }

        return parsed;
      }),
  }),
});


export const updateProductSchema = z.object({
  params: productIdParamSchema.shape.params,

  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters long.")
      .max(100, "Product name cannot exceed 100 characters.")
      .trim()
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters.")
      .trim()
      .optional()
      .nullable(),

    price: z
      .coerce
      .number()
      .positive("Price must be greater than 0.")
      .max(99999999.99, "Price is too large.")
      .refine(
        (value) => Number.isFinite(value) &&
          Math.round(value * 100) === value * 100,
        "Price can have a maximum of 2 decimal places."
      )
      .optional(),

    imageUrl: z
      .string()
      .trim()
      .url("Please provide a valid image URL.")
      .optional()
      .nullable(),

    unit: z
      .string()
      .trim()
      .min(1, "Product unit cannot be empty.")
      .max(30, "Product unit cannot exceed 30 characters.")
      .optional(),

  }).refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required to update a product.",
    }
  ),
});


