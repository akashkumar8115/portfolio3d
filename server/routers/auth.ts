import { TRPCError } from "@trpc/server";
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
import { loginSchema } from "@/lib/validation/auth";

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(({ ctx }) => ctx.user),
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
      let admin: ReturnType<typeof getAdminCredentials>;
      try {
        admin = getAdminCredentials();
      } catch {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.",
        });
      }
      if (input.email !== admin.email || input.password !== admin.password) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }

      let token: string;
      try {
        token = await createSessionToken({ email: admin.email, role: "admin" });
      } catch {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Admin sessions are not configured. Set AUTH_SECRET to at least 32 characters.",
        });
      }
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
