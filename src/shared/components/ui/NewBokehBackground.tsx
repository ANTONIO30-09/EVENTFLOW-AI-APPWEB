"use client";

import { motion } from "framer-motion";

const bubbles = [
  { size: 400, top: "10%", left: "10%", duration: 25 },
  { size: 600, top: "60%", left: "20%", duration: 35 },
  { size: 300, top: "20%", left: "80%", duration: 20 },
  { size: 500, top: "70%", left: "70%", duration: 30 },
  { size: 350, top: "40%", left: "45%", duration: 18 },
  { size: 450, top: "85%", left: "45%", duration: 28 },
  { size: 250, top: "50%", left: "90%", duration: 22 },
];

export default function NewBokehBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{ 
            width: b.size, 
            height: b.size, 
            top: b.top, 
            left: b.left,
            backgroundColor: "rgba(184, 134, 62, 0.25)" // Amarillo Oro / Bronce
          }}
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: b.duration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
}
