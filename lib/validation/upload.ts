import { z } from "zod";

export const maxUploadBytes = 20 * 1024 * 1024;

export const uploadMetadataSchema = z.object({
  type: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ]),
  size: z.number().int().positive().max(maxUploadBytes, "Files must be 20 MB or smaller."),
});

export const uploadExtensionByType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
} as const;
