"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useTRPC } from "@/lib/trpc";

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const trpc = useTRPC();
  const enabled = open && q.trim().length >= 2;
  const searchQuery = useQuery({
    ...trpc.search.site.queryOptions({ q: q.trim() }),
    enabled,
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goFull = () => {
    if (q.trim().length < 2) {
      return;
    }
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
        aria-label="Search website"
      >
        <FaSearch />
        <span className="hidden sm:inline">Search</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] bg-slate-900/40 p-4" onClick={() => setOpen(false)}>
          <div
            className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              <FaSearch className="text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(event) => setQ(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    goFull();
                  }
                }}
                placeholder="Search projects, blogs, companies..."
                className="h-14 flex-1 outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-slate-400">
                <FaTimes />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {q.trim().length < 2 && <p className="text-sm text-slate-500">Type 2+ characters. Press Enter for full results.</p>}
              {enabled && searchQuery.isLoading && <p className="text-sm text-slate-500">Searching...</p>}
              {searchQuery.data && (
                <div className="space-y-4">
                  {searchQuery.data.projects.map((item) => (
                    <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="block rounded-xl p-3 hover:bg-slate-50">
                      <p className="text-xs text-sky-600">Project</p>
                      <p className="font-medium">{item.title}</p>
                    </Link>
                  ))}
                  {searchQuery.data.blogs.map((item) => (
                    <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="block rounded-xl p-3 hover:bg-slate-50">
                      <p className="text-xs text-sky-600">Blog</p>
                      <p className="font-medium">{item.title}</p>
                    </Link>
                  ))}
                  {searchQuery.data.pages.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-xl p-3 hover:bg-slate-50">
                      <p className="text-xs text-sky-600">Page</p>
                      <p className="font-medium">{item.title}</p>
                    </Link>
                  ))}
                  {!searchQuery.data.projects.length && !searchQuery.data.blogs.length && !searchQuery.data.pages.length && (
                    <p className="text-sm text-slate-500">No matches.</p>
                  )}
                  <button type="button" onClick={goFull} className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white">
                    View all results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
