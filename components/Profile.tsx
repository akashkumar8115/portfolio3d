"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import GalaxyBackground from "@/components/GalaxyBackground";

const EarthGlobe = dynamic(() => import("@/components/three/EarthGlobe"), { ssr: false });
const StarField = dynamic(() => import("@/components/three/StarField"), { ssr: false });

export default function Profile() {
  return (
    <section id="profile" className="relative overflow-hidden bg-black pt-24 text-white">
      <GalaxyBackground />
      <StarField />
      <div className="hero-sun pointer-events-none absolute left-[-18px] top-[34%] z-[2] sm:left-2 sm:top-[30%] md:left-6">
        <span className="hero-sun-halo" />
        <span className="hero-sun-core" />
      </div>
      <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative mx-auto h-[300px] w-full max-w-[420px] sm:h-[380px] md:h-[440px]"
        >
          <EarthGlobe />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center md:text-left"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Technology Leadership &amp; Product Engineering</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Akash Kumar</h1>
          <p className="mt-3 text-xl font-medium text-slate-200">
            Technology Leader · Product Strategist · Full-Stack Engineer
          </p>
          <p className="mt-4 max-w-xl text-slate-300">
            I shape SaaS products, software architecture, and full-stack platforms for enterprise and
            specialized business needs, working across Intopie, VRV InfoLed, SKDS, and AM Future Tech Solution.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href="#contact"
              className="rounded-full bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-400"
            >
              Start a Project
            </a>
            <Link
              href="/projects"
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              Explore My Work
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
            <a href="https://www.linkedin.com/in/akash-kumar-54073a209/" target="_blank" rel="noopener noreferrer" aria-label="Akash Kumar on LinkedIn">
              <Image src="/images/linkedin.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-white/20 bg-white p-1" />
            </a>
            <a href="https://github.com/akashkumar8115" target="_blank" rel="noopener noreferrer" aria-label="Akash Kumar on GitHub">
              <Image src="/images/github.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-white/20 bg-white p-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
