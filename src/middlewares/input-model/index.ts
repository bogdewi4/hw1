import { NextFunction, Request, Response } from 'express';
import { validationResult, type ValidationError } from 'express-validator';

export const inputValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formattedErrors = validationResult(req).formatWith(
    (error: ValidationError) => {
      switch (error.type) {
        case 'field':
          return { message: error.msg, field: error.path };

        default:
          return {
            message: error.msg,
            field: 'Unknown',
          };
      }
    }
  );

  if (!formattedErrors.isEmpty()) {
    const errorMessage = formattedErrors.array({ onlyFirstError: true });

    const errors = {
      errorsMessages: errorMessage,
    };

    res.status(400).send(errors);
    return;
  }

  next();
};
