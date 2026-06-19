import type { NextFunction, Request, Response } from "express";
import type { ApiError, ApiSuccess } from "../types/contracts";

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function ok<T>(
  res: Response<ApiSuccess<T>>,
  data: T,
  statusCode = 200,
): Response<ApiSuccess<T>> {
  return res.status(statusCode).json({ success: true, data });
}

export function asyncHandler<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
>(
  handler: (
    req: TRequest,
    res: TResponse,
    next: NextFunction,
  ) => Promise<unknown>,
) {
  return (req: TRequest, res: TResponse, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

export function errorHandler(
  error: Error | AppError,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction,
) {
  void _req;
  void _next;

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong while processing the request.",
    },
  });
}
