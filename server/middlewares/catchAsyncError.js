// utils/catchAsyncError.js

import cleanupUploads from "../utils/cleanupUploads.js";

// const catchAsyncError = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     cleanupUploads(req);
//     next(error); // Forward the error to the global error handler
//   }
// };


// export default catchAsyncError;
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsyncError;
