"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { useTRPC } from "@/lib/trpc";
import PublicShell from "@/components/PublicShell";

function SearchResults() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const trpc = useTRPC();
  const enabled = q.trim().length >= 2;
  const searchQuery = useQuery({
    ...trpc.search.site.queryOptions({ q: q.trim() }),
    enabled,
  });
  const data = searchQuery.data;
  const total = useMemo(
    () => (data ? data.projects.length + data.blogs.length + data.pages.length : 0),
    [data],
  );

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Search</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Find anything on the site</h1>
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search projects, blogs, companies..."
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg outline-none focus:border-sky-400"
          />
        </form>
        {!enabled && <p className="mt-6 text-slate-500">Type at least 2 characters.</p>}
        {enabled && searchQuery.isLoading && <p className="mt-6 text-slate-500">Searching...</p>}
        {data && (
          <div className="mt-8 space-y-8">
            <p className="text-sm text-slate-500">{total} results for “{data.query}”</p>
            {data.projects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Projects</h2>
                <div className="mt-3 space-y-3">
                  {data.projects.map((item) => (
                    <Link key={item.id} href={item.href} className="block rounded-2xl border border-slate-200 p-4 hover:border-sky-300">
                      <p className="text-xs uppercase text-sky-600">{item.kind}</p>
                      <p className="font-semibold">{item.title}</p>
                      <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {data.blogs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Blogs</h2>
                <div className="mt-3 space-y-3">
                  {data.blogs.map((item) => (
                    <Link key={item.id} href={item.href} className="block rounded-2xl border border-slate-200 p-4 hover:border-sky-300">
                      <p className="font-semibold">{item.title}</p>
                      <p className="line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {data.pages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold">Pages</h2>
                <div className="mt-3 space-y-3">
                  {data.pages.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-2xl border border-slate-200 p-4 hover:border-sky-300">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.href}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {total === 0 && <p className="text-slate-500">No matches. Try another keyword.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <PublicShell>
      <Suspense fallback={<p className="px-4 py-16 text-center">Loading search...</p>}>
        <SearchResults />
      </Suspense>
    </PublicShell>
  );
}
