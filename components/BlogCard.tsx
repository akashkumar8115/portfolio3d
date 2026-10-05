"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getGoogleDriveImageSource } from "@/lib/projectMedia";

export type BlogCardData = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  tags?: string[];
  createdAt?: string | null;
};

export default function BlogCard({ blog, compact = false }: { blog: BlogCardData; compact?: boolean }) {
  return (
    <Link href={`/blogs/${blog.id}`} className={compact ? "block min-w-[300px] max-w-[300px] snap-start sm:min-w-[340px] sm:max-w-[340px]" : "block"}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.015 }}
        className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <div className={`overflow-hidden bg-slate-100 ${compact ? "h-40" : "h-48"}`}>
          {blog.image ? (
            <img
              src={getGoogleDriveImageSource(blog.image)}
              alt={blog.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-slate-100 text-sm font-semibold text-sky-700">
              Blog
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs uppercase tracking-wide text-sky-600">Article</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{blog.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(blog.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-sky-700">Read more →</p>
        </div>
      </motion.article>
    </Link>
  );
}
