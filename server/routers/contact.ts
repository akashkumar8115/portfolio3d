import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { MessageModel } from "@/server/models/Message";

function serializeMessage(item: {
  _id: { toString(): string };
  name: string;
  email: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}) {
  return {
    id: item._id.toString(),
    name: item.name,
    email: item.email,
    message: item.message,
    read: Boolean(item.read),
    createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : null,
  };
}

export const contactRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Enter a valid email address"),
        message: z.string().min(1, "Message is required"),
      }),
    )
    .mutation(async ({ input }) => {
      await connectDB();
      await MessageModel.create(input);

      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: input,
          }),
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Message saved, but email delivery failed.",
          });
        }
      }

      return { ok: true as const };
    }),
  inbox: adminProcedure.query(async () => {
    await connectDB();
    const [items, unread] = await Promise.all([
      MessageModel.find().sort({ createdAt: -1 }).limit(50).lean(),
      MessageModel.countDocuments({ read: false }),
    ]);
    return {
      unread,
      items: items.map(serializeMessage),
    };
  }),
  markRead: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    await connectDB();
    await MessageModel.findByIdAndUpdate(input.id, { read: true });
    return { ok: true as const };
  }),
  markAllRead: adminProcedure.mutation(async () => {
    await connectDB();
    await MessageModel.updateMany({ read: false }, { read: true });
    return { ok: true as const };
  }),
});
