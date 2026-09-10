import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { getSessionFromCookieHeader, type AdminSession } from "@/server/auth";

export type TRPCContext = {
  req: Request;
  user: AdminSession | null;
};

export async function createTRPCContext(opts: { req: Request }): Promise<TRPCContext> {
  const user = await getSessionFromCookieHeader(opts.req.headers.get("cookie"));
  return { req: opts.req, user };
}

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please log in to continue." });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});
