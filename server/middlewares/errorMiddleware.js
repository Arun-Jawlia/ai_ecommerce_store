import cleanupUploads from "../utils/cleanupUploads.js";

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  cleanupUploads(req);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongo duplicate key
  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field value entered", 409);
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new ErrorHandler("Validation failed", 400, true, messages);
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token, try again", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token expired", 401);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((e) => e.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
