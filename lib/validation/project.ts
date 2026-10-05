import { z } from "zod";
import {
  boundedString,
  boundedStringList,
  displayOrderSchema,
  mediaLocationSchema,
  objectIdSchema,
  optionalHttpsUrlSchema,
} from "./common";

const linkedinUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid LinkedIn URL.")
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))
    );
  }, "Enter a valid HTTPS LinkedIn URL.");

const githubUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid GitHub URL.")
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (url.hostname === "github.com" || url.hostname === "www.github.com")
    );
  }, "Enter a valid HTTPS GitHub URL.");

const socialLinksSchema = z
  .object({
    linkedin: z.union([z.literal(""), linkedinUrlSchema]).optional(),
  })
  .strict()
  .optional()
  .transform((links) => {
    if (!links) return undefined;
    return links.linkedin ? { linkedin: links.linkedin } : {};
  });

const projectShape = z.object({
  title: z.string().trim()
    .min(2, "Project title must be at least 2 characters.")
    .max(120, "Project title must be 120 characters or fewer."),
  description: z.string().trim()
    .min(8, "Description must be at least 8 characters.")
    .max(1000, "Description must be 1,000 characters or fewer."),
  image: mediaLocationSchema,
  github: z.union([z.literal(""), githubUrlSchema]).default(""),
  demo: optionalHttpsUrlSchema,
  socialLinks: socialLinksSchema,
  isVideo: z.boolean().default(false),
  technologies: boundedStringList(50, 60, "Technologies"),
  company: boundedString(120, "Company").default(""),
  role: boundedString(120, "Role").default(""),
  projectType: boundedString(120, "Project subtype").default(""),
  highlights: boundedStringList(50, 160, "Highlights"),
  details: boundedString(20_000, "Project details").default(""),
  kind: z.enum(["personal", "partnership"]).default("personal"),
  companySlug: z.string().trim()
    .max(80, "Company slug must be 80 characters or fewer.")
    .regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/, "Choose a valid partnership company.")
    .default(""),
  category: z.enum(["Web Development", "Full Stack", "Frontend", "Backend"]).default("Full Stack"),
  published: z.boolean().default(true),
  order: displayOrderSchema.default(0),
}).strict();

function validatePartnership(
  project: z.output<typeof projectShape>,
  context: z.RefinementCtx,
) {
  if (project.kind === "partnership" && !project.companySlug) {
    context.addIssue({
      code: "custom",
      path: ["companySlug"],
      message: "Choose a partnership company.",
    });
  }
}

export const projectCreateSchema = projectShape.superRefine(validatePartnership);
export const projectUpdateSchema = projectShape
  .extend({ id: objectIdSchema })
  .superRefine((project, context) => validatePartnership(project, context));

export type ProjectInput = z.output<typeof projectCreateSchema>;
