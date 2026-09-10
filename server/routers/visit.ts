import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { VisitorModel, VisitStatsModel } from "@/server/models/Visit";

function getCookie(req: Request, name: string) {
  return req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export const visitRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    await connectDB();
    const stats = await VisitStatsModel.findOneAndUpdate(
      { key: "global" },
      { $setOnInsert: { key: "global", totalViews: 0, uniqueVisitors: 0 } },
      { upsert: true, new: true },
    );
    return {
      totalViews: stats.totalViews,
      uniqueVisitors: stats.uniqueVisitors,
    };
  }),
  hit: publicProcedure.mutation(async ({ ctx }) => {
    await connectDB();
    const existingId = getCookie(ctx.req, "portfolio_visitor");
    const visitorId = existingId || randomUUID();
    const isNew = !existingId;

    if (isNew) {
      const store = await cookies();
      store.set("portfolio_visitor", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    if (isNew) {
      await VisitorModel.create({ visitorId, lastSeenAt: new Date() });
    } else {
      await VisitorModel.findOneAndUpdate(
        { visitorId },
        { lastSeenAt: new Date() },
        { upsert: true },
      );
    }

    const stats = await VisitStatsModel.findOneAndUpdate(
      { key: "global" },
      {
        $inc: {
          totalViews: 1,
          uniqueVisitors: isNew ? 1 : 0,
        },
        $setOnInsert: { key: "global" },
      },
      { upsert: true, new: true },
    );

    return {
      visitorId,
      isNew,
      totalViews: stats.totalViews,
      uniqueVisitors: stats.uniqueVisitors,
      value: stats.uniqueVisitors,
    };
  }),
  adminStats: adminProcedure.query(async () => {
    await connectDB();
    const stats = await VisitStatsModel.findOne({ key: "global" });
    return {
      totalViews: stats?.totalViews ?? 0,
      uniqueVisitors: stats?.uniqueVisitors ?? 0,
    };
  }),
});
