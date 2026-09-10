"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ventures } from "@/server/data/projects";

export default function Leadership() {
  return (
    <section id="leadership" className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Ventures</p>
        <h2 className="mt-2 text-center text-4xl font-bold text-slate-900">Partnerships</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-slate-600">
          Click a company to open the projects I built in that partnership.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ventures.map((role, index) => (
            <Link key={role.slug} href={`/ventures/${role.slug}`} className="block">
              <motion.article
                initial={{ opacity: 0, y: 24, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: index * 0.06 }}
                className="h-full rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">{role.legal}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{role.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{role.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  {role.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold text-sky-700">See projects in this partnership →</p>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
