import { Request, Response, NextFunction } from "express";
import { query, param, validationResult } from "express-validator";

export const validateCompareProducts = [
  query("id1")
    .notEmpty()
    .withMessage("El parámetro id1 es requerido.")
    .isNumeric()
    .withMessage("El parámetro id1 debe ser un número."),
  query("id2")
    .notEmpty()
    .withMessage("El parámetro id2 es requerido.")
    .isNumeric()
    .withMessage("El parámetro id2 debe ser un número."),
];

export const validateGetProductById = [
  param("id").isNumeric().withMessage("El parámetro id debe ser un número."),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};
