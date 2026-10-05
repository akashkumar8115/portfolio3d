"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/lib/trpc";

function ordinal(value: number) {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) {
    return `${value}th`;
  }
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

export default function Contact() {
  const trpc = useTRPC();
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const didHit = useRef(false);

  const hitVisit = useMutation(
    trpc.visit.hit.mutationOptions({
      onSuccess: (data) => {
        setUniqueVisitors(data.uniqueVisitors);
        setTotalViews(data.totalViews);
      },
    }),
  );

  useEffect(() => {
    if (!didHit.current) {
      didHit.current = true;
      hitVisit.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="contact" className="bg-white px-4 py-16 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Connect</p>
        <h2 className="mt-2 text-4xl font-bold">Contact</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:20dec024@gmail.com"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3"
          >
            <img src="/images/email.png" alt="" className="h-6 w-6" />
            akash2884182@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/akash-kumar-54073a209/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3"
          >
            <img src="/images/linkedin.png" alt="" className="h-6 w-6 rounded-full bg-white" />
            LinkedIn
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 p-8 text-center text-slate-800 shadow-sm">
        <p className="text-lg font-semibold">Thank you for visiting.</p>
        <p className="mt-3 text-base">
          You are the <span className="rounded-lg bg-white px-2 py-1 font-bold text-sky-700">{ordinal(uniqueVisitors || 1)}</span>{" "}
          unique visitor. This page has been viewed <strong>{totalViews}</strong> times.
        </p>
      </div>
    </section>
  );
}
