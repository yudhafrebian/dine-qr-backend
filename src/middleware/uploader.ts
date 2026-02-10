import multer from "multer";

export const uploaderMemory = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
    fileFilter(req, file, callback: any) {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });
};
