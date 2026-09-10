"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import BlogCard from "@/components/BlogCard";
import PublicShell from "@/components/PublicShell";

export default function BlogsPage() {
  const trpc = useTRPC();
  const blogsQuery = useQuery(trpc.blog.getAll.queryOptions());
  const blogs = blogsQuery.data ?? [];

  return (
    <PublicShell>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Writing</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">All blogs</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Full archive of articles. Click any card to read in detail.</p>
          {blogsQuery.isLoading && <p className="py-16 text-center text-slate-500">Loading blogs...</p>}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          {!blogsQuery.isLoading && !blogs.length && (
            <p className="py-16 text-center text-slate-500">No blogs published yet.</p>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
