import BlogCard from "@/components/BlogCard";
import PublicShell from "@/components/PublicShell";
import { listPublishedBlogs } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const blogs = await listPublishedBlogs();

  return (
    <PublicShell>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Writing</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Notes on Products &amp; Engineering</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            First-hand writing on product strategy, software architecture, and building digital products.
          </p>
          {blogs.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
            </div>
          ) : (
            <p className="py-16 text-center text-slate-500">No blogs published yet.</p>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
