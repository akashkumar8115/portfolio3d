import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { BlogModel } from "@/server/models/Blog";
import { serializeBlog } from "@/lib/content";

const blogInput = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(8),
  content: z.string().min(20),
  image: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    await connectDB();
    const blogs = await BlogModel.find({ published: { $ne: false } }).sort({ order: 1, createdAt: -1 }).lean();
    return blogs.map(serializeBlog);
  }),
  getById: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input }) => {
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
  create: adminProcedure.input(blogInput).mutation(async ({ input }) => {
    await connectDB();
    const created = await BlogModel.create(input);
    return serializeBlog(created.toObject());
  }),
  update: adminProcedure.input(blogInput.extend({ id: z.string().min(1) })).mutation(async ({ input }) => {
    await connectDB();
    const { id, ...data } = input;
    const updated = await BlogModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found." });
    }
    return serializeBlog(updated.toObject());
  }),
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    await connectDB();
    const deleted = await BlogModel.findByIdAndDelete(input.id);
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found." });
    }
    return { ok: true as const };
  }),
});
