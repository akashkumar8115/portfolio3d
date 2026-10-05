"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc";
import PublicShell from "@/components/PublicShell";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const blogQuery = useQuery(trpc.blog.getById.queryOptions({ id: params.id }));
  const blog = blogQuery.data;

  return (
    <PublicShell>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/blogs" className="text-sm font-semibold text-sky-700">
            ← All blogs
          </Link>
          {blogQuery.isLoading && <p className="py-16 text-center text-slate-500">Loading article...</p>}
          {blogQuery.isError && <p className="py-16 text-center text-red-500">This article is not available.</p>}
          {blog && (
            <article className="mt-8">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Blog</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">{blog.title}</h1>
              {blog.createdAt && (
                <p className="mt-2 text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
              )}
              {blog.image && (
                <img
                  src={getGoogleDriveImageSource(blog.image)}
                  alt={blog.title}
                  className="mt-8 w-full rounded-3xl object-cover"
                />
              )}
              <p className="mt-8 text-lg leading-8 text-slate-700">{blog.excerpt}</p>
              <div className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700">{blog.content}</div>
              <div className="mt-8 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
