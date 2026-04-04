import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../lib/env";

type UploadedFile = {
  path?: string;
  secure_url?: string;
};

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "user_profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
} as any);

const fileFilter: multer.Options["fileFilter"] = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadSinglePhoto = upload.single("photo");

export function runUserProfilePhotoUpload(request: FastifyRequest, reply: FastifyReply): Promise<UploadedFile | undefined> {
  return new Promise((resolve, reject) => {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      reject(new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."));
      return;
    }

    uploadSinglePhoto(request.raw as any, reply.raw as any, (err: unknown) => {
      if (err) {
        reject(err);
        return;
      }

      const file = (request.raw as any).file as UploadedFile | undefined;
      resolve(file);
    });
  });
}
