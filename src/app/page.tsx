"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { Great_Vibes, Playfair_Display } from "next/font/google";
import CanvasParticles from "@/shared/components/ui/CanvasParticles";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

const VIDEO_LOCAL_URL = "/videos/fondo.mp4";

const slides = [
  { id: 1, kicker: "LA NUEVA ERA", title: "BODAS", desc: "Gestiona invitados, distribuye mesas con Inteligencia Artificial y controla el inventario en tiempo real.", image: "/images/v2_novios.png", isBig: true },
  { id: 2, kicker: "15 AÑOS", title: "FIESTAS", desc: "Organiza la quinceañera perfecta. Asigna mesas automáticamente y evita conflictos entre invitados.", image: "/images/v2_quinceanera.png", isBig: false },
  { id: 3, kicker: "CELEBRACIONES", title: "EVENTOS", desc: "La logística de tu evento corporativo o graduación, elevada a la excelencia con nuestro motor de IA.", image: "/images/v2_discurso.png", isBig: true },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0, scale: 0.95 }),
  center: { zIndex: 10, x: 0, opacity: 1, scale: 1, transition: { x: { type: "spring" as const, stiffness: 250, damping: 30 }, opacity: { duration: 0.2 }, scale: { duration: 0.4 } } },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0, scale: 0.95, transition: { x: { type: "spring" as const, stiffness: 250, damping: 30 }, opacity: { duration: 0.2 } } })
};

const storytellingTexts = [
  "Deja que la Inteligencia Artificial haga el trabajo pesado.",
  "Olvídate del estrés, el caos y los errores manuales.",
  "Solo preocúpate por disfrutar. Nosotros nos encargamos del resto."
];

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

  const neonGoldStyle = {
    color: "#FFF8D6",
    textShadow: "0 0 5px #FFF8D6, 0 0 15px #FFD700, 0 0 30px #FFD700, 0 0 50px #B8863E, 0 0 80px #B8863E",
  };

  return (
    <div className="w-full relative min-h-screen bg-[#0d131f] selection:bg-brand-bronze selection:text-brand-night overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0d131f]" />
        <div className="absolute inset-0 opacity-60 blur-[100px]" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, rgba(184, 134, 62, 0.4) 0, transparent 50%), radial-gradient(circle at 80% 60%, rgba(255, 215, 0, 0.2) 0, transparent 50%), radial-gradient(circle at 50% 90%, rgba(62, 122, 92, 0.3) 0, transparent 50%)" }} />
      </div>

      <CanvasParticles />

      {/* NAVBAR GLASS */}
      <nav className="fixed top-0 left-0 w-full z-[100] flex justify-between items-center p-6 lg:p-10 max-w-[1600px] mx-auto left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-brand-bronze/10 rounded-full p-1 border border-brand-bronze/30">
            <Image src="/images/logo.png" alt="EventFlow" fill className="object-contain p-1" />
          </div>
          <span className="text-xl font-bold tracking-widest text-brand-porcelain uppercase hidden sm:block">EventFlow</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/dashboard" className="text-xs font-bold tracking-widest uppercase text-brand-porcelain/80 hover:text-brand-bronze transition-colors duration-300 hidden sm:block">Iniciar Sesión</Link>
          <Link href="/register" className="group relative text-xs font-bold tracking-widest uppercase bg-brand-bronze/20 text-brand-bronze px-6 py-3 md:px-8 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-brand-bronze hover:text-brand-night backdrop-blur-sm border border-brand-bronze/30 shadow-[0_0_20px_rgba(184,134,62,0.2)]">
            <span className="relative z-10">Registrarse</span>
          </Link>
        </div>
      </nav>

      {/* HERO GLASS */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-10">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 mix-blend-overlay">
          <source src={VIDEO_LOCAL_URL} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0d131f]/90 via-[#0d131f]/50 to-transparent z-10" />

        <div className="relative z-30 flex flex-col items-center text-center px-6 mx-auto max-w-4xl p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="relative flex items-center justify-center w-full">
            <motion.div initial={{ clipPath: "inset(-100px 100% -100px 0)" }} animate={{ clipPath: "inset(-100px 0% -100px 0)" }} transition={{ duration: 5, ease: [0.45, 0.05, 0.25, 1], delay: 1 }} className="w-full flex justify-center">
              <h1 className={`${greatVibes.className} text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-none whitespace-nowrap`} style={neonGoldStyle}>EventFlow AI</h1>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6.5, duration: 1.5 }} className="relative z-20 text-brand-porcelain/80 text-base md:text-lg lg:text-xl max-w-2xl mt-8 mb-10 font-light">
            Bienvenido a la nueva era de la logística de eventos. Descubre cómo la Inteligencia Artificial puede transformar tu próximo gran evento.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.5, duration: 1 }} className="relative z-20 text-brand-bronze flex flex-col items-center gap-2 mt-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Desliza para descubrir</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}><ChevronDown size={24} /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* STORYTELLING GLASS */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-10 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d131f]/80 via-transparent to-[#0d131f] z-10 pointer-events-none" />
        <div className="relative z-30 w-full max-w-4xl mx-auto px-6 flex items-center justify-center text-center">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 md:p-16 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <AnimatePresence mode="wait">
              <motion.h2 key={textIndex} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -30, filter: "blur(10px)" }} transition={{ duration: 0.8, ease: "easeInOut" }} className={`${playfair.className} text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]`}>
                {storytellingTexts[textIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SLIDER GLASS */}
      <section className="relative h-screen w-full overflow-hidden z-20">
        <main className="relative z-10 h-full w-full max-w-[1600px] mx-auto px-6 lg:px-10 flex items-center">
          <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] z-20 pointer-events-none" />
          <div className="relative z-30 w-full lg:w-[50%] pt-20">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={page} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex flex-col pr-4 lg:pr-12 bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <span className="text-brand-bronze font-bold tracking-[0.4em] text-[10px] md:text-xs mb-4 uppercase">{currentSlide.kicker}</span>
                <h1 className="font-sans font-black text-[4.5rem] md:text-[7.5rem] lg:text-[9.5rem] leading-[0.8] tracking-tighter mb-8 text-brand-porcelain drop-shadow-2xl">{currentSlide.title}</h1>
                <p className="text-brand-porcelain/70 text-sm md:text-lg max-w-md mb-12 leading-relaxed font-light">{currentSlide.desc}</p>
                <div className="flex items-center gap-6">
                  <button className="group relative w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden transition-all hover:border-brand-bronze backdrop-blur-md">
                    <div className="absolute inset-0 bg-brand-bronze translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <ArrowRight size={24} className="relative z-10 group-hover:text-brand-night group-hover:translate-x-1 transition-all duration-300" />
                  </button>
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-brand-porcelain/40">Descubrir más</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute right-0 bottom-0 w-full md:w-[70%] h-[95vh] z-20 pointer-events-none flex justify-center md:justify-end items-end overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={page} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="relative z-10 w-full h-full flex justify-center md:justify-end items-end">
                <Image src={currentSlide.image} alt={currentSlide.title} width={1200} height={1200} className={`object-contain object-bottom w-auto h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-transform duration-700 ${currentSlide.isBig ? 'scale-110 md:scale-[1.2] origin-bottom' : 'scale-100'}`} priority />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="absolute bottom-0 left-0 w-full z-50 max-w-[1600px] mx-auto px-6 lg:px-10 pb-10 flex justify-between items-end left-1/2 -translate-x-1/2">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl flex items-center gap-6 w-full max-w-[350px]">
            <span className="text-sm font-black text-brand-bronze tracking-widest font-serif italic">0{page + 1}</span>
            <div className="flex-1 h-[1px] bg-white/20 relative overflow-hidden rounded-full">
              <motion.div className="absolute top-0 left-0 h-full bg-brand-bronze shadow-[0_0_20px_rgba(184,134,62,1)]" initial={false} animate={{ width: `${((page + 1) / slides.length) * 100}%` }} transition={{ duration: 0.5, ease: "circOut" }} />
            </div>
            <span className="text-sm font-black text-brand-porcelain/20 tracking-widest font-serif italic">0{slides.length}</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => paginate(-1)} className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-brand-porcelain/70 hover:text-brand-porcelain"><ArrowLeft size={20} /></button>
            <button onClick={() => paginate(1)} className="w-16 h-16 rounded-full bg-brand-bronze text-brand-night flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(184,134,62,0.5)]"><ArrowRight size={28} /></button>
          </div>
        </footer>
      </section>
    </div>
  );
}
