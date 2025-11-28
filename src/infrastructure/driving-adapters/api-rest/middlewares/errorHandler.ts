import { Request, Response, NextFunction } from 'express';
import { ProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Es buena práctica loguear el error

  if (err instanceof ProductNotFoundException) {
    return res.status(404).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Error interno del servidor' });
};