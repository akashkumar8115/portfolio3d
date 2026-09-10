import { createTRPCRouter } from "@/server/trpc";
import { authRouter } from "@/server/routers/auth";
import { contactRouter } from "@/server/routers/contact";
import { blogRouter } from "@/server/routers/blog";
import { projectRouter } from "@/server/routers/project";
import { searchRouter } from "@/server/routers/search";
import { visitRouter } from "@/server/routers/visit";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  project: projectRouter,
  blog: blogRouter,
  contact: contactRouter,
  search: searchRouter,
  visit: visitRouter,
});

export type AppRouter = typeof appRouter;
