import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { MessageModel } from "@/server/models/Message";
import { inquirySchema } from "@/lib/leadValidation";

function serializeMessage(item: {
  _id: { toString(): string };
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}) {
  return {
    id: item._id.toString(),
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    company: item.company ?? "",
    service: item.service ?? "",
    budget: item.budget ?? "",
    timeline: item.timeline ?? "",
    message: item.message,
    read: Boolean(item.read),
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : null,
  };
}

export const contactRouter = createTRPCRouter({
  send: publicProcedure
    .input(inquirySchema)
    .mutation(async ({ input }) => {
      await connectDB();
      await MessageModel.create(input);
      return { ok: true as const };
    }),
  inbox: adminProcedure.query(async () => {
    await connectDB();
    const [items, total, unread] = await Promise.all([
      MessageModel.find().sort({ createdAt: -1 }).limit(50).lean(),
      MessageModel.countDocuments(),
      MessageModel.countDocuments({ read: false }),
    ]);
    return {
      total,
      unread,
      items: items.map(serializeMessage),
    };
  }),
  getById: adminProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input }) => {
    await connectDB();
    const item = await MessageModel.findById(input.id).lean();
    if (!item) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found." });
    }
    return serializeMessage(item);
  }),
  markRead: adminProcedure
    .input(z.object({ id: z.string().min(1), read: z.boolean().optional().default(true) }))
    .mutation(async ({ input }) => {
      await connectDB();
      const updated = await MessageModel.findByIdAndUpdate(
        input.id,
        { read: input.read },
        { new: true, runValidators: true },
      );
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found." });
      }
      return serializeMessage(updated);
    }),
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    await connectDB();
    const deleted = await MessageModel.findByIdAndDelete(input.id);
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found." });
    }
    return { ok: true as const };
  }),
  markAllRead: adminProcedure.mutation(async () => {
    await connectDB();
    await MessageModel.updateMany({ read: false }, { read: true });
    return { ok: true as const };
  }),
});
