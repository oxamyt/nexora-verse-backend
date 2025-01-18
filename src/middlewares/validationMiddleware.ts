import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateData(schema: z.ZodType<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(400)
          .json({
            error: `Invalid data`,
            details: errorMessages,
            success: false,
          });
      }
    }
  };
}
