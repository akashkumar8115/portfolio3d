"use client";

import { type IconType } from "react-icons";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

type SkillPlanetProps = {
  name: string;
  icon: IconType;
  color: string;
  delay?: number;
};

export default function SkillPlanet({ name, icon: Icon, color, delay = 0 }: SkillPlanetProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-42, 42], [16, -16]), { stiffness: 220, damping: 16 });
  const rotateY = useSpring(useTransform(x, [-42, 42], [-16, 16]), { stiffness: 220, damping: 16 });

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 180, damping: 16 }}
      className="flex flex-col items-center gap-3 [perspective:900px]"
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.96 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        <span
          className="pointer-events-none absolute -inset-2 rounded-full opacity-50 blur-md"
          style={{ background: color }}
        />
        <span className="skill-orbit pointer-events-none absolute -inset-1 rounded-full border border-white/40" />
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full shadow-xl sm:h-24 sm:w-24"
          style={{
            background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${color} 38%, #0f172a 100%)`,
            transform: "translateZ(24px)",
          }}
        >
          <Icon className="relative z-10 h-8 w-8 text-white drop-shadow sm:h-10 sm:w-10" />
        </div>
      </motion.div>
      <h4 className="text-center text-sm font-medium text-slate-800">{name}</h4>
    </motion.div>
  );
}
