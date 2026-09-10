import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "@/server/trpc";
import {
  clearSessionCookie,
  createSessionToken,
  getAdminCredentials,
  setSessionCookie,
} from "@/server/auth";
import { connectDB } from "@/server/db";
import { MessageModel } from "@/server/models/Message";
import { ProjectModel } from "@/server/models/Project";
import { VisitStatsModel } from "@/server/models/Visit";

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(({ ctx }) => ctx.user),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const admin = getAdminCredentials();
      if (input.email !== admin.email || input.password !== admin.password) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      const token = await createSessionToken({ email: admin.email, role: "admin" });
      await setSessionCookie(token);
      return { email: admin.email, role: "admin" as const };
    }),
  logout: publicProcedure.mutation(async () => {
    await clearSessionCookie();
    return { ok: true as const };
  }),
  dashboard: adminProcedure.query(async () => {
    await connectDB();
    const [projects, messages, unread, stats] = await Promise.all([
      ProjectModel.countDocuments(),
      MessageModel.countDocuments(),
      MessageModel.countDocuments({ read: false }),
      VisitStatsModel.findOne({ key: "global" }),
    ]);

    const recentMessages = await MessageModel.find().sort({ createdAt: -1 }).limit(8).lean();

    return {
      projects,
      messages,
      unread,
      totalViews: stats?.totalViews ?? 0,
      uniqueVisitors: stats?.uniqueVisitors ?? 0,
      recentMessages: recentMessages.map((item) => ({
        id: String(item._id),
        name: item.name,
        email: item.email,
        message: item.message,
        read: Boolean(item.read),
        createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : null,
      })),
    };
  }),
});
