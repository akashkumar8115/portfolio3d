"use client";

import { motion } from "framer-motion";
import {
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiPython,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiThreedotjs,
  SiTrpc,
  SiTypescript,
  SiVercel,
  SiVite,
  SiZod,
} from "react-icons/si";
import { FaAws, FaCss3Alt } from "react-icons/fa";
import SkillPlanet from "@/components/SkillPlanet";

const frontendSkills = [
  { name: "HTML", icon: SiHtml5, color: "#e34f26" },
  { name: "CSS", icon: FaCss3Alt, color: "#1572b6" },
  { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
  { name: "React", icon: SiReact, color: "#61dafb" },
  { name: "Next.js", icon: SiNextdotjs, color: "#111827" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#38bdf8" },
  { name: "Three.js", icon: SiThreedotjs, color: "#000000" },
  { name: "Redux", icon: SiRedux, color: "#764abc" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055ff" },
  { name: "Vite", icon: SiVite, color: "#646cff" },
];

const backendSkills = [
  { name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
  { name: "Express", icon: SiExpress, color: "#404040" },
  { name: "Python", icon: SiPython, color: "#3776ab" },
  { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
  { name: "tRPC", icon: SiTrpc, color: "#398ccb" },
  { name: "Zod", icon: SiZod, color: "#3068b7" },
  { name: "Firebase", icon: SiFirebase, color: "#ffca28" },
  { name: "GraphQL", icon: SiGraphql, color: "#e10098" },
  { name: "JWT", icon: SiJsonwebtokens, color: "#000000" },
  { name: "REST / Postman", icon: SiPostman, color: "#ff6c37" },
];

const cloudSkills = [
  { name: "Git", icon: SiGit, color: "#f05032" },
  { name: "GitHub", icon: SiGithub, color: "#24292f" },
  { name: "AWS", icon: FaAws, color: "#ff9900" },
  { name: "Docker", icon: SiDocker, color: "#2496ed" },
  { name: "Linux", icon: SiLinux, color: "#fcc624" },
  { name: "Vercel", icon: SiVercel, color: "#111827" },
];

const groups = [
  { title: "Frontend", skills: frontendSkills },
  { title: "Backend", skills: backendSkills },
  { title: "Cloud & Tools", skills: cloudSkills },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-white px-4 py-20 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-sky-600">Capabilities</p>
        <h2 className="mt-2 text-center text-4xl font-bold">Technical Skills</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Drag your cursor over each planet. Hover to tilt, tap on mobile, and explore the stack.
        </p>
        <div className="mt-12 space-y-8">
          {groups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.06 }}
              className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 sm:p-7"
            >
              <h3 className="mb-6 text-center text-xl font-semibold text-sky-700">{group.title}</h3>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.skills.map((skill, index) => (
                  <SkillPlanet
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                    color={skill.color}
                    delay={index * 0.04}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
