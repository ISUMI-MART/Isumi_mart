import { ZodError } from "zod"; 

export const validate = (Schema) => {
  return async (
    req,res,next,) => {
    try {
      const parsed = (await Schema.parseAsync({
        
        body: req.body,
        query: req.query,
        params: req.params,
      }));

      req.validated = {
        body: parsed.body,
        query: parsed.query,
        params: parsed.params,
      };
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join(".").replace("body.", ""),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errorMessages,
        });
        return;
      }

      console.error("Unexpected error during validation:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};
