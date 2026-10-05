import { z } from "zod";
import { boundedString, objectIdSchema } from "./validation/common";

export const inquiryServices = [
  "SaaS Product",
  "Custom Software",
  "Enterprise Platform",
  "Product Architecture",
  "Technical Consulting",
  "Digital Transformation",
  "Other",
] as const;

export const inquirySources = ["google", "linkedin", "direct", "referral"] as const;

export const inquiryBudgets = [
  "Under $5,000",
  "$5,000–$15,000",
  "$15,000–$50,000",
  "$50,000+",
  "To be discussed",
] as const;

export const inquiryTimelines = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3+ months",
  "Just exploring",
] as const;

function attributionValue(maxLength: number, label: string) {
  return boundedString(maxLength, label).refine(
    (value) => !/[\u0000-\u001f\u007f]/.test(value),
    `${label} contains unsupported characters.`,
  );
}

export const inquirySchema = z.object({
  name: z.string().trim()
    .min(2, "Please enter your name.")
    .max(120, "Name must be 120 characters or fewer.")
    .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u, "Please enter a valid name."),
  email: z.string().trim()
    .max(254, "Email address must be 254 characters or fewer.")
    .email("Please enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  phone: z.string().trim()
    .max(30, "Phone number must be 30 characters or fewer.")
    .refine((phone) => {
      if (!phone) return true;
      const digitCount = phone.replace(/\D/g, "").length;
      return /^\+?[0-9][0-9\s().-]*$/.test(phone) && digitCount >= 7 && digitCount <= 15;
    }, "Please enter a valid phone number, including country code if needed.")
    .optional().default(""),
  company: boundedString(120, "Company").default(""),
  service: z.enum(inquiryServices, { error: "Choose a service from the list." }),
  budget: z.union([
    z.enum(inquiryBudgets, { error: "Choose a budget range from the list." }),
    z.literal(""),
  ]).optional().default(""),
  timeline: z.union([
    z.enum(inquiryTimelines, { error: "Choose a timeline from the list." }),
    z.literal(""),
  ]).optional().default(""),
  message: z.string().trim()
    .min(10, "Please tell us a little more about your project.")
    .max(5000, "Project details must be 5,000 characters or fewer."),
  source: z.enum(inquirySources).optional().default("direct"),
  landingPage: z.string().trim()
    .max(500, "Landing path must be 500 characters or fewer.")
    .refine((value) => {
      if (!value) return true;
      if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) {
        return false;
      }
      try {
        const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
        return (
          pathname.startsWith("/") &&
          !pathname.startsWith("//") &&
          !pathname.includes("\\") &&
          pathname.split("/").every((segment) => segment !== "." && segment !== "..")
        );
      } catch {
        return false;
      }
    }, "Landing path must be a safe local path.")
    .optional().default(""),
  referrer: z.union([
    z.literal(""),
    z.string().trim().url("Referrer must be a valid URL.").refine((value) => {
      const url = new URL(value);
      return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
    }, "Referrer must be a valid web URL."),
  ]).pipe(z.string().max(500, "Referrer must be 500 characters or fewer."))
    .optional().default(""),
  utmSource: attributionValue(150, "Campaign source").optional().default(""),
  utmMedium: attributionValue(150, "Campaign medium").optional().default(""),
  utmCampaign: attributionValue(150, "Campaign name").optional().default(""),
  utmContent: attributionValue(150, "Campaign content").optional().default(""),
  utmTerm: attributionValue(150, "Campaign term").optional().default(""),
}).strict();

export type InquiryInput = z.infer<typeof inquirySchema>;

export const leadIdSchema = z.object({ id: objectIdSchema });
export const leadReadSchema = z.object({ id: objectIdSchema, read: z.boolean().default(true) });
