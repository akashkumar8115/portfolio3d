import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { ProjectModel } from "@/server/models/Project";
import { seedProjectsIfEmpty } from "@/server/seed";
import { projectCategories, ventures } from "@/server/data/projects";
import { serializeProject } from "@/lib/content";
import { objectIdSchema } from "@/lib/validation/common";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validation/project";

function normalizeProjectCompany<T extends { kind: "personal" | "partnership"; companySlug: string; company: string }>(
  project: T,
) {
  if (project.kind === "personal") {
    return { ...project, company: "", companySlug: "" };
  }
  const venture = ventures.find((item) => item.slug === project.companySlug);
  if (!venture) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Choose a valid partnership company." });
  }
  return { ...project, company: venture.name };
}

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        kind: z.enum(["personal", "partnership"]).optional(),
        companySlug: z.string().trim().max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      }),
    )
    .query(async ({ input }) => {
      await connectDB();
      await seedProjectsIfEmpty();
      const filter: Record<string, unknown> = { published: { $ne: false } };
      if (input.kind) {
        filter.kind = input.kind;
      }
      if (input.companySlug) {
        filter.companySlug = input.companySlug;
      }
      const projects = await ProjectModel.find(filter).sort({ order: 1, createdAt: -1 }).lean();
      return projects.map(serializeProject);
    }),
  getById: publicProcedure.input(z.object({ id: objectIdSchema })).query(async ({ input }) => {
    await connectDB();
    const project = await ProjectModel.findOne({ _id: input.id, published: { $ne: false } }).lean();
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
  create: adminProcedure.input(projectCreateSchema).mutation(async ({ input }) => {
    await connectDB();
    const created = await ProjectModel.create(normalizeProjectCompany(input));
    return serializeProject(created.toObject());
  }),
  update: adminProcedure
    .input(projectUpdateSchema)
    .mutation(async ({ input }) => {
      await connectDB();
      const { id, ...data } = input;
      const updated = await ProjectModel.findByIdAndUpdate(id, normalizeProjectCompany(data), { new: true, runValidators: true });
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
      }
      return serializeProject(updated.toObject());
    }),
  delete: adminProcedure.input(z.object({ id: objectIdSchema })).mutation(async ({ input }) => {
    await connectDB();
    const deleted = await ProjectModel.findByIdAndDelete(input.id);
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
    }
    return { ok: true as const };
  }),
});
