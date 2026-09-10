"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GalaxyBackground from "@/components/GalaxyBackground";

const EarthGlobe = dynamic(() => import("@/components/three/EarthGlobe"), { ssr: false });
const StarField = dynamic(() => import("@/components/three/StarField"), { ssr: false });

export default function Profile() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const textToType = "Akash Kumar";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isTyping) {
        const next = textToType.slice(0, text.length + 1);
        setText(next);
        if (next === textToType) {
          setIsTyping(false);
        }
      } else {
        const next = text.slice(0, -1);
        setText(next);
        if (!next) {
          setIsTyping(true);
        }
      }
    }, isTyping ? 180 : 80);

    return () => window.clearTimeout(timer);
  }, [text, isTyping]);

  const downloadCV = async () => {
    const response = await fetch("/Resume.pdf");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Akash_Kumar_Resume.pdf";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

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
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Tech Entrepreneur</p>
          <h1 className="mt-3 min-h-[3.5rem] text-4xl font-bold text-white sm:text-5xl">
            {text}
            <span className="animate-pulse text-sky-400">|</span>
          </h1>
          <p className="mt-3 text-xl font-medium text-slate-200">
            Strategic Partner across Intopie, VRV InfoLed, SKDS, and AM Future Tech Solution
          </p>
          <p className="mt-4 max-w-xl text-slate-300">
            I steer SaaS products from concept to launch, deliver scalable enterprise web solutions,
            and solve operational challenges for institutional and commercial clients.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <button
              type="button"
              onClick={downloadCV}
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              Download CV
            </button>
            <a
              href="#contact"
              className="rounded-full bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-400"
            >
              Work With Me
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
            <a href="https://www.linkedin.com/in/akash-kumar-54073a209/" target="_blank" rel="noreferrer">
              <img src="/images/linkedin.png" alt="LinkedIn" className="h-10 w-10 rounded-full border border-white/20 bg-white p-1" />
            </a>
            <a href="https://github.com/akashkumar8115" target="_blank" rel="noreferrer">
              <img src="/images/github.png" alt="GitHub" className="h-10 w-10 rounded-full border border-white/20 bg-white p-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
