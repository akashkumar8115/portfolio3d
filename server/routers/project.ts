import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { ProjectModel } from "@/server/models/Project";
import { seedProjectsIfEmpty } from "@/server/seed";
import { projectCategories } from "@/server/data/projects";

const linkedinUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"));
  }, "Enter a valid HTTPS LinkedIn URL.");

const socialLinksInput = z
  .object({
    linkedin: z.union([z.literal(""), linkedinUrl]).optional(),
  })
  .optional()
  .transform((links) =>
    links ? (links.linkedin ? { linkedin: links.linkedin } : {}) : undefined,
  );

const projectInput = z.object({
  title: z.string().min(2),
  description: z.string().min(8),
  image: z.string().min(1),
  github: z.string().optional().default(""),
  demo: z.string().optional().default(""),
  socialLinks: socialLinksInput,
  isVideo: z.boolean().optional().default(false),
  technologies: z.array(z.string()).optional().default([]),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  projectType: z.string().optional().default(""),
  highlights: z.array(z.string()).optional().default([]),
  details: z.string().optional().default(""),
  kind: z.enum(["personal", "partnership"]).optional().default("personal"),
  companySlug: z.string().optional().default(""),
  category: z.enum(["Web Development", "Full Stack", "Frontend", "Backend"]).default("Full Stack"),
  published: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

function serializeProject(project: {
  _id: { toString(): string };
  title: string;
  description: string;
  image: string;
  github?: string;
  demo?: string;
  socialLinks?: { linkedin?: string | null } | null;
  isVideo?: boolean;
  technologies?: string[];
  company?: string;
  role?: string;
  projectType?: string;
  highlights?: string[];
  details?: string;
  kind?: string;
  companySlug?: string;
  category?: string;
  published?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: project._id.toString(),
    title: project.title,
    description: project.description,
    image: project.image,
    github: project.github ?? "",
    demo: project.demo ?? "",
    socialLinks: project.socialLinks?.linkedin ? { linkedin: project.socialLinks.linkedin } : undefined,
    isVideo: Boolean(project.isVideo),
    technologies: project.technologies ?? [],
    company: project.company ?? "",
    role: project.role ?? "",
    projectType: project.projectType ?? "",
    highlights: project.highlights ?? [],
    details: project.details ?? "",
    kind: project.kind === "partnership" ? "partnership" : "personal",
    companySlug: project.companySlug ?? "",
    category: project.category ?? "Full Stack",
    published: project.published !== false,
    order: project.order ?? 0,
    createdAt: project.createdAt?.toISOString() ?? null,
    updatedAt: project.updatedAt?.toISOString() ?? null,
  };
}

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        kind: z.enum(["personal", "partnership"]).optional(),
        companySlug: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      await connectDB();
      await seedProjectsIfEmpty();
      const filter: Record<string, unknown> = { published: true };
      if (input.kind) {
        filter.kind = input.kind;
      }
      if (input.companySlug) {
        filter.companySlug = input.companySlug;
      }
      const projects = await ProjectModel.find(filter).sort({ order: 1, createdAt: -1 }).lean();
      return projects.map(serializeProject);
    }),
  getById: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input }) => {
    await connectDB();
    const project = await ProjectModel.findOne({ _id: input.id, published: true }).lean();
    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
    }
    return serializeProject(project);
  }),
  getCategories: publicProcedure.query(() => projectCategories),
  adminList: adminProcedure.query(async () => {
    await connectDB();
    await seedProjectsIfEmpty();
    const projects = await ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean();
    return projects.map(serializeProject);
  }),
  create: adminProcedure.input(projectInput).mutation(async ({ input }) => {
    await connectDB();
    const created = await ProjectModel.create(input);
    return serializeProject(created.toObject());
  }),
  update: adminProcedure
    .input(projectInput.extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await connectDB();
      const { id, ...data } = input;
      const updated = await ProjectModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
      }
      return serializeProject(updated.toObject());
    }),
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    await connectDB();
    const deleted = await ProjectModel.findByIdAndDelete(input.id);
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
    }
    return { ok: true as const };
  }),
});
