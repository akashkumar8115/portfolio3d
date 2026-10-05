import { z } from "zod";

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

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(30, "Phone number must be 30 characters or fewer."),
  company: z.string().trim().max(120, "Company name must be 120 characters or fewer."),
  service: z.enum(inquiryServices, { error: "Choose the support you need." }),
  budget: z.union([z.enum(inquiryBudgets), z.literal("")]),
  timeline: z.union([z.enum(inquiryTimelines), z.literal("")]),
  message: z.string().trim().min(10, "Please add a few details (at least 10 characters).").max(5000),
  source: z.enum(inquirySources).optional().default("direct"),
  landingPage: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  utmSource: z.string().max(150).optional().default(""),
  utmMedium: z.string().max(150).optional().default(""),
  utmCampaign: z.string().max(150).optional().default(""),
  utmContent: z.string().max(150).optional().default(""),
  utmTerm: z.string().max(150).optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
