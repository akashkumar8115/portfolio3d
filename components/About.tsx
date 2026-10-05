"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const FloatingScene = dynamic(() => import("@/components/three/FloatingScene"), { ssr: false });

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 px-4 py-20 text-slate-900 sm:px-6">
      <FloatingScene />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">About</p>
        <h2 className="mt-2 text-center text-4xl font-bold">Product Thinking. Engineering Delivery.</h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative mx-auto h-72 w-72 [perspective:1000px]"
          >
            <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <Image
                src="/images/profilepic.jpg"
                alt="Akash Kumar"
                width={288}
                height={288}
                sizes="288px"
                className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-2xl [backface-visibility:hidden]"
              />
              <div className="absolute inset-0 rounded-3xl bg-white p-6 text-sm text-slate-700 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <h3 className="text-lg font-semibold text-sky-700">Akash Kumar</h3>
                <p className="mt-4 leading-7">
                  Partner and product leader working across <b>  Intopie, VRV InfoLed, SKDS, and AM Future
                  Tech Solution.</b>
                </p>
              </div>
            </div>
          </motion.div>
          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Technology Leader &amp; Product Strategist</h3>
              <p className="mt-4 leading-7 text-slate-600">
                I work across product strategy, architecture, and full-stack engineering to turn
                complex requirements into useful digital products. My work spans SaaS, enterprise
                platforms, custom software, and digital transformation through partnerships with
                Intopie, VRV InfoLed, SKDS, and AM Future Tech Solution.
              </p>
              <p className="mt-4 leading-7 text-slate-600">
                I stay involved from product direction and system design through implementation,
                helping teams make deliberate technical choices and deliver software that fits real workflows.
              </p>
            </div>
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">What I Do</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Product Strategy",
                  body: "Clarify product direction, priorities, and delivery roadmaps.",
                },
                {
                  title: "Software Architecture",
                  body: "Shape maintainable systems around product and operational needs.",
                },
                {
                  title: "Full-Stack Engineering",
                  body: "Build end-to-end web experiences, APIs, and data-backed features.",
                },
                {
                  title: "SaaS Development",
                  body: "Develop product capabilities from early scope through iterative delivery.",
                },
                {
                  title: "Enterprise Solutions",
                  body: "Deliver custom platforms and integrations for complex workflows.",
                },
                {
                  title: "Digital Transformation",
                  body: "Apply software and architecture to improve established processes.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                </article>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
