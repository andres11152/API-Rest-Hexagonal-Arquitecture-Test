import { Request, Response, NextFunction } from 'express';

export class ProductNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundException';
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ProductNotFoundException) {
    res.status(404).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
