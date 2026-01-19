import fs from "fs";

const cleanupUploads = (req) => {
  if (!req.files) return;

  Object.values(req.files).forEach((file) => {
    // handle single or multiple files
    const files = Array.isArray(file) ? file : [file];

    files.forEach((f) => {
      if (f.tempFilePath && fs.existsSync(f.tempFilePath)) {
        fs.unlinkSync(f.tempFilePath);
      }
    });
  });
};

export default cleanupUploads;
