"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import OptimizedImage from "@/shared/components/ui/OptimizedImage";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import ParticlesBackground from "@/shared/components/ui/ParticlesBackground";
import { HandwrittenTitle } from "@/shared/components/ui/HandwrittenTitle";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const VIDEO_LOCAL_URL = "/videos/fondo.mp4";

const slides = [
  { id: 1, kicker: "LA NUEVA ERA", title: "BODAS", desc: "Gestiona invitados, distribuye mesas con Inteligencia Artificial y controla el inventario en tiempo real.", image: "/images/v2_novios.png", isBig: true },
  { id: 2, kicker: "15 AÑOS", title: "FIESTAS", desc: "Organiza la quinceañera perfecta. Asigna mesas automáticamente y evita conflictos entre invitados.", image: "/images/v2_quinceanera.png", isBig: false },
  { id: 3, kicker: "CELEBRACIONES", title: "EVENTOS", desc: "La logística de tu evento corporativo o graduación, elevada a la excelencia con nuestro motor de IA.", image: "/images/v2_discurso.png", isBig: true },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 10,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.6 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.6 }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: "tween", ease: "easeIn", duration: 0.2 },
      opacity: { duration: 0.15 }
    }
  })
};

const storytellingTexts = [
  "Deja que la Inteligencia Artificial haga el trabajo pesado.",
  "Olvídate del estrés, el caos y los errores manuales.",
  "Solo preocúpate por disfrutar. Nosotros nos encargamos del resto."
];

const kineticContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const kineticChar: Variants = {
  hidden: { y: "120%", opacity: 0, rotateZ: 5 },
  visible: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

export default function LandingPage() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % storytellingTexts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const paginate = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) newPage = slides.length - 1;
    if (newPage >= slides.length) newPage = 0;
    setPage([newPage, newDirection]);
  };

  const currentSlide = slides[page];

  return (
    <div className="w-full relative min-h-screen bg-[#0d131f] selection:bg-brand-bronze selection:text-brand-night overflow-x-hidden">
      
      {/* 1. FONDO DE VIDEO FIJO */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 opacity-50">
        <source src={VIDEO_LOCAL_URL} type="video/mp4" />
      </video>
      
      {/* 2. CAPA OSCURA */}
      <div className="fixed inset-0 z-[1] bg-[#0d131f]/60 pointer-events-none" />

      {/* 3. PARTÍCULAS */}
      <ParticlesBackground />

      {/* 4. CONTENIDO */}
      <div className="relative z-10">
        
        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 lg:p-10 max-w-[1600px] mx-auto left-1/2 -translate-x-1/2 bg-transparent">
          <Link href="/" className="flex items-center gap-4 group transition-all duration-300">
            <div className="relative w-12 h-12 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-full p-2 border border-brand-bronze/40 shadow-[0_0_15px_rgba(184,134,62,0.2)] group-hover:shadow-[0_0_25px_rgba(184,134,62,0.6)] group-hover:border-brand-bronze transition-all duration-500">
              <Image src="/images/logo.png" alt="EventFlow" fill className="object-contain p-2 drop-shadow-md" />
            </div>
            <span className="text-2xl font-black tracking-[0.2em] uppercase hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-brand-porcelain via-[#FFD700] to-brand-porcelain bg-[length:200%_auto] group-hover:bg-[position:right_center] transition-all duration-700">
              EventFlow
            </span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/dashboard" className="group relative text-xs font-bold tracking-widest uppercase text-brand-porcelain/80 hover:text-white transition-colors duration-300 hidden sm:block">
              Iniciar Sesión
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-bronze to-[#FFD700] transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></span>
            </Link>
            <Link href="/register" className="group relative text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night px-7 py-3.5 md:px-9 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] border border-[#FFD700]/50">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 font-black">Registrarse</span>
            </Link>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="relative z-30 flex flex-col items-center justify-center text-center px-6 mx-auto w-[95%] max-w-7xl py-12 md:py-16">
            {/* Gradient Mesh del Hero */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(13,19,31,0.9)_0%,_rgba(13,19,31,0.4)_50%,_transparent_80%)] blur-2xl pointer-events-none scale-110" />
            <div className="w-full px-4 max-w-6xl mx-auto drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
              <HandwrittenTitle />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 1.5 }} className="relative z-20 flex flex-col items-center max-w-2xl mx-auto mt-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-brand-bronze to-transparent mb-6" />
              <p className="text-brand-porcelain text-base md:text-lg lg:text-xl max-w-xl font-medium leading-relaxed tracking-wide text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                <span className="block text-[#FFD700] font-bold mb-3 tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
                  Bienvenido a la nueva era
                </span>
                Descubre cómo la <span className="text-[#FFD700] font-extrabold drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">Inteligencia Artificial</span> puede transformar la logística de tu próximo gran evento.
              </p>
            </motion.div>
          </div>
        </section>

        {/* STORYTELLING KINETIC */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="relative z-30 w-full max-w-5xl mx-auto px-6 flex items-center justify-center text-center [perspective:1000px]">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={textIndex} 
                variants={kineticContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight flex flex-wrap justify-center gap-x-4 gap-y-2`}
              >
                {storytellingTexts[textIndex].split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-flex overflow-hidden pb-2 -mb-2">
                    {word.split("").map((char, charIndex) => (
                      <motion.span 
                        key={charIndex} 
                        variants={kineticChar} 
                        className="inline-block drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>
        </section>

        {/* SLIDER SECTION */}
        <section className="relative h-screen w-full overflow-hidden">
          <main className="relative z-10 h-full w-full max-w-[1600px] mx-auto px-6 lg:px-10 flex flex-col justify-center pt-20">
            
            <div className="relative z-30 w-full lg:w-[55%]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={page} 
                  custom={direction} 
                  variants={slideVariants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit" 
                  className="relative flex flex-col p-6 md:p-10 w-full max-w-2xl"
                >
                  {/* Gradient Mesh del Slider (Oro y Azul Noche difuminados) */}
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_left,_rgba(13,19,31,0.95)_0%,_rgba(13,19,31,0.6)_40%,_transparent_70%)] blur-xl pointer-events-none scale-125" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-[2px] bg-gradient-to-r from-brand-bronze to-transparent"></span>
                    <span className="text-brand-bronze font-bold tracking-[0.5em] text-[11px] md:text-xs uppercase drop-shadow-[0_0_8px_rgba(184,134,62,0.5)]">{currentSlide.kicker}</span>
                  </div>
                  
                  <h1 className={`${playfair.className} text-[5.5rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter mb-6 text-brand-porcelain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]`}>
                    {currentSlide.title}
                  </h1>
                  
                  <p className="text-brand-porcelain/80 text-base md:text-lg max-w-md mb-10 leading-relaxed font-light">
                    {currentSlide.desc}
                  </p>
                  
                  <Link href="#" className="group relative inline-flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-all duration-500 hover:border-brand-bronze/50 hover:bg-brand-bronze/10 w-fit">
                    <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-brand-porcelain group-hover:text-[#FFD700] transition-colors duration-300">
                      Descubrir más
                    </span>
                    <ArrowRight size={20} className="relative z-10 text-brand-bronze group-hover:text-[#FFD700] transform group-hover:translate-x-2 transition-all duration-300" />
                    
                    {/* Efecto de destello al pasar el mouse */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute right-0 bottom-0 w-full md:w-[65%] h-[90vh] z-20 pointer-events-none flex justify-center md:justify-end items-end overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={page} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="relative z-10 w-full h-full flex justify-center md:justify-end items-end">
                  <OptimizedImage 
                    src={currentSlide.image} 
                    alt={currentSlide.title} 
                    width={1200} 
                    height={1200} 
                    className={`object-contain object-bottom w-auto h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] will-change-transform transition-transform duration-700 ${currentSlide.id === 2 ? "translate-x-8 md:translate-x-16 lg:translate-x-24" : ""} ${currentSlide.id === 3 ? "md:translate-x-4 lg:translate-x-12" : ""} ${currentSlide.isBig ? "scale-110 md:scale-[1.15] origin-bottom" : "scale-100"}`} 
                    containerClassName="w-full h-full flex justify-center md:justify-end items-end"
                    priority 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* CONTROLES INFERIORES - SOLO FLECHAS, SIN BARRA */}
            <div className="absolute bottom-8 right-6 lg:right-10 z-50 flex justify-end items-end">
              <div className="flex items-center gap-4">
                <button onClick={() => paginate(-1)} className="group p-4 text-brand-porcelain/40 hover:text-white transition-all duration-300">
                  <ArrowLeft size={36} strokeWidth={1.5} className="transform group-hover:-translate-x-2 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </button>
                <button onClick={() => paginate(1)} className="group p-4 text-brand-bronze hover:text-[#FFD700] transition-all duration-300">
                  <ArrowRight size={48} strokeWidth={1.5} className="transform group-hover:translate-x-2 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(184,134,62,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.9)]" />
                </button>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
