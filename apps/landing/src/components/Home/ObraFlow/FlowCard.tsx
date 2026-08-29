"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FlowCardProps {
  eyebrow: string;
  title: string;
  detail: string;
  value?: string;
  icon: LucideIcon;
  delay?: number;
  featured?: boolean;
}

const FlowCard = ({
  eyebrow,
  title,
  detail,
  value,
  icon: Icon,
  delay = 0,
  featured = false,
}: FlowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay }}
      className={`relative rounded-2xl border p-5 ${
        featured
          ? "border-primary/40 bg-white shadow-xl shadow-primary/10"
          : "border-white/10 bg-white/5 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
              featured ? "text-primary" : "text-white/45"
            }`}
          >
            {eyebrow}
          </p>

          <h3
            className={`mt-2 text-base font-semibold ${
              featured ? "text-secondary" : "text-white"
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-1 text-xs ${
              featured ? "text-accent" : "text-white/50"
            }`}
          >
            {detail}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            featured ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {value && (
        <div className="mt-5 border-t border-current/10 pt-4">
          <p
            className={`text-xl font-semibold tracking-tight ${
              featured ? "text-secondary" : "text-white"
            }`}
          >
            {value}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default FlowCard;
