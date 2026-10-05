import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { BlogModel } from "@/server/models/Blog";
import { serializeBlog } from "@/lib/content";
import { objectIdSchema } from "@/lib/validation/common";
import { blogCreateSchema, blogUpdateSchema } from "@/lib/validation/blog";

export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    await connectDB();
    const blogs = await BlogModel.find({ published: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
    return blogs.map(serializeBlog);
  }),
  getById: publicProcedure.input(z.object({ id: objectIdSchema })).query(async ({ input }) => {
    await connectDB();
    const blog = await BlogModel.findOne({ _id: input.id, published: { $ne: false } }).lean();
    if (!blog) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found." });
    }
    return serializeBlog(blog);
  }),
  adminList: adminProcedure.query(async () => {
    await connectDB();
    const blogs = await BlogModel.find().sort({ order: 1, createdAt: -1 }).lean();
    return blogs.map(serializeBlog);
  }),
  create: adminProcedure.input(blogCreateSchema).mutation(async ({ input }) => {
    await connectDB();
    const created = await BlogModel.create(input);
    return serializeBlog(created.toObject());
  }),
  update: adminProcedure.input(blogUpdateSchema).mutation(async ({ input }) => {
    await connectDB();
    const { id, ...data } = input;
    const updated = await BlogModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found." });
    }
    return serializeBlog(updated.toObject());
  }),
  delete: adminProcedure.input(z.object({ id: objectIdSchema })).mutation(async ({ input }) => {
    await connectDB();
    const deleted = await BlogModel.findByIdAndDelete(input.id);
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found." });
    }
    return { ok: true as const };
  }),
});
