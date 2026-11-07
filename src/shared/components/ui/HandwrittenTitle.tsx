"use client";

import { Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

export function HandwrittenTitle({ text = "EventFlow AI" }: { text?: string }) {
  return (
    <svg viewBox="0 0 1200 200" className="block w-full h-auto overflow-visible">
      <defs>
        <filter id="neon-glow" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b1" />
          <feGaussianBlur stdDeviation="10" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.text
        x="600"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        className={greatVibes.className}
        fontSize={140}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        fill="#FFFFFF"
        filter="url(#neon-glow)"
        initial={{ strokeDasharray: 2000, strokeDashoffset: 2000, fillOpacity: 0 }}
        animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
        transition={{
          strokeDashoffset: { duration: 3.5, ease: "easeInOut" },
          fillOpacity: { duration: 1.2, delay: 3, ease: "easeIn" },
        }}
      >
        {text}
      </motion.text>
    </svg>
  );
}
