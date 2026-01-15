import ErrorHandler from "../middlewares/errorMiddleware.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";

// Register a user
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters.", 400)
    );
  }
  email = email.toLowerCase().trim();

  const isAlreadyRegistered = await database.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (isAlreadyRegistered.rows.length > 0) {
    return next(
      new ErrorHandler("User already registered with this email.", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await database.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  sendToken(user.rows[0], 201, "User registered successfully", res);
});
// Register a user

export const loginUser = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  email = email.toLowerCase().trim();

  const result = await database.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!result.rows.length) {
    return next(new ErrorHandler("Invalid credentials.", 401));
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials.", 401));
  }

  delete user.password;

  sendToken(user, 200, "Login successful", res);
});

// Register a user
export const getUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  const result = await database.query(
    `SELECT * FROM users WHERE id = $1`,
    [userId]
  );

  if (!result.rows.length) {
    return next(new ErrorHandler("User not found.", 404));
  }

  delete result.rows[0].password;

  res.status(200).json({
    success: true,
    user: result.rows[0]
  });
});

export const logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully"
    });
});

