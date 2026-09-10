"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const FloatingScene = dynamic(() => import("@/components/three/FloatingScene"), { ssr: false });

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 px-4 py-20 text-slate-900 sm:px-6">
      <FloatingScene />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Professional bio</p>
        <h2 className="mt-2 text-center text-4xl font-bold">About Me</h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative mx-auto h-72 w-72 [perspective:1000px]"
          >
            <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <img
                src="/images/profilepic.jpg"
                alt="Akash Kumar"
                className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-2xl [backface-visibility:hidden]"
              />
              <div className="absolute inset-0 rounded-3xl bg-white p-6 text-sm text-slate-700 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <h3 className="text-lg font-semibold text-sky-700">Akash Kumar</h3>
                <p className="mt-4 leading-7">
                  Partner and product leader working across Intopie, VRV InfoLed, SKDS, and AM Future
                  Tech Solution.
                </p>
              </div>
            </div>
          </motion.div>
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Tech Entrepreneur and Strategic Partner</h3>
              <p className="mt-4 leading-7 text-slate-600">
                Active leadership across private tech ventures including Intopie, VRV InfoLed, SKDS,
                and AM Future Tech Solution. Experienced in steering SaaS products from concept to
                launch, delivering scalable enterprise web solutions, and solving operational
                challenges for institutional and commercial clients.
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "SaaS from concept to launch",
                  body: "Product strategy, architecture, roadmaps, and deployment pipelines.",
                },
                {
                  title: "Enterprise delivery",
                  body: "Custom software and web platforms for B2B and institutional clients.",
                },
                {
                  title: "Digital transformation",
                  body: "Architecture and consulting for specialized industry workflows.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="font-semibold text-sky-700">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
