import { z } from "zod";

export const inquiryServices = [
  "SaaS product or MVP",
  "Website or web application",
  "Product strategy",
  "Technical consulting",
  "Engineering partnership",
  "Other",
] as const;

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

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(30, "Phone number must be 30 characters or fewer."),
  company: z.string().trim().max(120, "Company name must be 120 characters or fewer."),
  service: z.enum(inquiryServices, { error: "Choose the support you need." }),
  budget: z.union([z.enum(inquiryBudgets), z.literal("")]),
  timeline: z.union([z.enum(inquiryTimelines), z.literal("")]),
  message: z.string().trim().min(20, "Please tell us a little more (at least 20 characters).").max(5000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
