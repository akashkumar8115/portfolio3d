"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import AutoCarousel from "@/components/AutoCarousel";
import BlogCard from "@/components/BlogCard";

export default function Blogs() {
  const trpc = useTRPC();
  const blogsQuery = useQuery(trpc.blog.getAll.queryOptions());
  const blogs = blogsQuery.data ?? [];

  return (
    <section id="blogs" className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Writing</p>
        <h2 className="mt-2 text-center text-4xl font-bold text-slate-900">Blogs</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Notes on product, architecture, and delivery. Click a card to read the full article.
        </p>

        {blogsQuery.isLoading && <p className="py-12 text-center text-slate-500">Loading blogs...</p>}
        {!blogsQuery.isLoading && !blogs.length && (
          <p className="py-12 text-center text-slate-500">New articles will appear here soon.</p>
        )}

        {blogs.length > 0 && (
          <AutoCarousel>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} compact />
            ))}
          </AutoCarousel>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/blogs"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600"
          >
            View all blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
