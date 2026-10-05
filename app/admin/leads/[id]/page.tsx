"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "@/lib/trpc";

export default function AdminLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const leadQuery = useQuery(trpc.contact.getById.queryOptions({ id: params.id }));

  useEffect(() => {
    if (!status) {
      return;
    }
    const timer = window.setTimeout(() => setStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const markRead = useMutation(
    trpc.contact.markRead.mutationOptions({
      onSuccess: async (lead) => {
        setStatus(lead.read ? "Lead marked as read." : "Lead marked as unread.");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.contact.getById.queryKey({ id: params.id }) }),
          queryClient.invalidateQueries({ queryKey: trpc.contact.inbox.queryKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.auth.dashboard.queryKey() }),
        ]);
      },
      onError: (error) => setStatus(error.message),
    }),
  );

  const lead = leadQuery.data;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {status && (
          <p
            role={markRead.isError ? "alert" : "status"}
            className={`fixed right-4 top-4 z-50 max-w-sm rounded-2xl border bg-white p-4 shadow-xl ${
              markRead.isError ? "border-rose-200 text-rose-700" : "border-emerald-200 text-emerald-700"
            }`}
          >
            {status}
          </p>
        )}
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900">
          ← Back to dashboard
        </Link>

        {leadQuery.isLoading && <p className="py-20 text-center text-slate-500">Loading inquiry...</p>}
        {leadQuery.isError && (
          <div role="alert" className="mt-8 rounded-2xl border border-rose-200 bg-white p-6 text-rose-700">
            Could not load this lead: {leadQuery.error.message}
          </div>
        )}

        {lead && (
          <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <header className="bg-gradient-to-r from-slate-950 to-sky-950 px-6 py-8 text-white sm:px-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">Project inquiry</p>
                  <h1 className="mt-2 text-3xl font-bold">{lead.name}</h1>
                  <p className="mt-2 text-slate-300">{lead.service || "General inquiry"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lead.read ? "bg-white/10 text-slate-200" : "bg-amber-300 text-slate-950"}`}>
                  {lead.read ? "Read" : "Unread"}
                </span>
              </div>
            </header>

            <div className="grid gap-8 p-6 sm:p-9">
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact details</h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">Email</dt>
                    <dd className="mt-1 font-medium">
                      <a className="text-sky-700 hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a>
                    </dd>
                  </div>
                  {lead.phone && (
                    <div>
                      <dt className="text-xs text-slate-500">Phone / WhatsApp</dt>
                      <dd className="mt-1 font-medium">
                        <a className="text-sky-700 hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </dd>
                    </div>
                  )}
                  {lead.company && (
                    <div>
                      <dt className="text-xs text-slate-500">Company</dt>
                      <dd className="mt-1 font-medium">{lead.company}</dd>
                    </div>
                  )}
                  {lead.createdAt && (
                    <div>
                      <dt className="text-xs text-slate-500">Received</dt>
                      <dd className="mt-1 font-medium">{new Date(lead.createdAt).toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {(lead.budget || lead.timeline) && (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project planning</h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {lead.budget && (
                      <div>
                        <dt className="text-xs text-slate-500">Estimated budget</dt>
                        <dd className="mt-1 font-medium">{lead.budget}</dd>
                      </div>
                    )}
                    {lead.timeline && (
                      <div>
                        <dt className="text-xs text-slate-500">Target timeline</dt>
                        <dd className="mt-1 font-medium">{lead.timeline}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project details</h2>
                <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">{lead.message}</p>
              </section>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                <a
                  href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your project inquiry")}`}
                  className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  disabled={markRead.isPending}
                  onClick={() => markRead.mutate({ id: lead.id, read: !lead.read })}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Mark as {lead.read ? "unread" : "read"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
