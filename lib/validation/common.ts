import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Record ID is invalid.");

export const displayOrderSchema = z
  .number({ error: "Enter a valid display order." })
  .finite("Enter a valid display order.")
  .int("Display order must be a whole number.")
  .min(0, "Display order cannot be negative.");

export const httpsUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  }, "Use a valid HTTPS URL.");

export const optionalHttpsUrlSchema = z.union([
  z.literal(""),
  httpsUrlSchema,
]).default("");

export const mediaLocationSchema = z
  .string()
  .trim()
  .min(1, "Add a media URL or upload a file.")
  .max(2048, "Media URL must be 2,048 characters or fewer.")
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
      try {
        const decodedPath = decodeURIComponent(value.split(/[?#]/, 1)[0]);
        return (
          decodedPath.startsWith("/") &&
          !decodedPath.startsWith("//") &&
          !decodedPath.includes("\\") &&
          decodedPath.split("/").every((segment) => segment !== "." && segment !== "..")
        );
      } catch {
        return false;
      }
    }

    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "Use an HTTPS media URL, Google Drive link, or a safe local path.");

export const optionalMediaLocationSchema = z.union([
  z.literal(""),
  mediaLocationSchema,
]).default("");

export function boundedString(max: number, label: string) {
  return z.string().trim().max(max, `${label} must be ${max} characters or fewer.`);
}

export function boundedStringList(maxItems: number, maxLength: number, label: string) {
  return z
    .array(
      z.string().trim()
        .min(1, `${label} entries cannot be empty.`)
        .max(maxLength, `${label} entries must be ${maxLength} characters or fewer.`),
    )
    .max(maxItems, `Use no more than ${maxItems} ${label.toLowerCase()} entries.`)
    .default([])
    .transform((items) => [...new Set(items)]);
}
