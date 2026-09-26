"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Download, Sparkles, Cpu, Layers } from "lucide-react";

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt physics for interactive 3D perspective
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const skillsList = [
    "ML",
    "GenAI",
    "LLMs",
    "Computer Vision",
    "PyTorch",
    "YOLO",
    "RAG",
    "FastAPI",
    "Data Pipelines",
    "Edge AI",
    "AI Video Analytics",
    "ML Security Analyst",
    "Local Deployment Specialist"
  ];

  return (
    <section id="home" className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-primary-cyan/12 rounded-full blur-[140px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-primary-purple/12 rounded-full blur-[140px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/8 rounded-full blur-[160px]" />

        {/* Cyber grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          style={{ backgroundSize: "36px 36px" }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Text, Intro & Skills Matrix */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-start lg:col-span-6 pr-0 lg:pr-4"
        >
          {/* Current Role Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-primary-cyan/40 text-xs font-semibold text-primary-cyan mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-primary-cyan animate-ping" />
            <span className="text-foreground/90 font-medium">AI/ML Engineer Trainee</span>
            <span className="text-primary-cyan">@ Assimilate Technologies</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 leading-[1.18]">
            Hi, I'm <br />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(0,240,255,0.35)]">
              Madhala Siva Narayana Surya Chandra
            </span>
          </h1>

          <h2 className="text-lg sm:text-xl text-foreground/90 font-semibold mb-3 flex items-center gap-2">
            <span className="text-primary-cyan font-mono">&lt;</span>
            AI/ML Engineer & Intelligent Systems Specialist
            <span className="text-primary-purple font-mono">/&gt;</span>
          </h2>

          <p className="text-foreground/75 text-sm sm:text-base mb-5 max-w-lg leading-relaxed">
            Specializing in Generative AI, LLMs, Computer Vision, Edge AI, and scalable local deployment architectures that bridge deep learning with enterprise production pipelines.
          </p>

          {/* Interactive Skills & Competencies Matrix Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 max-w-lg">
            {skillsList.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.03, duration: 0.3 }}
                className="px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-lg glass-panel border border-white/10 hover:border-primary-cyan/50 hover:bg-primary-cyan/10 hover:text-primary-cyan text-foreground/80 transition-all cursor-default select-none shadow-sm"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5 items-center">
            <a
              href="#projects"
              className="px-6 py-2.5 sm:px-7 sm:py-3 bg-gradient-to-r from-primary-cyan to-accent-blue text-slate-950 font-bold text-sm sm:text-base rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Explore My Work <ArrowRight size={16} />
            </a>
            <a
              href="/resume/siva_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-6 py-2.5 sm:px-7 sm:py-3 glass-panel border border-white/15 font-medium text-sm sm:text-base rounded-full hover:bg-white/10 hover:border-primary-cyan/40 active:scale-95 transition-all flex items-center gap-2 text-foreground"
            >
              Download CV <Download size={16} />
            </a>
          </div>
        </motion.div>

        {/* Right Column: Clean Centered Portrait Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative lg:col-span-6 flex items-center justify-center py-4"
          style={{ perspective: 1000 }}
        >
          {/* Main 3D Interactive Container */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative flex items-center justify-center select-none"
          >
            {/* Ambient Radial Glow Behind Figure */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[380px] sm:w-[460px] lg:w-[500px] h-[380px] sm:h-[460px] lg:h-[500px] rounded-full bg-gradient-to-tr from-primary-cyan/25 via-primary-purple/20 to-accent-blue/25 blur-3xl pointer-events-none -z-10"
            />

            {/* Subtle Rotating Tech Orbital Rings */}
            <div className="absolute w-[350px] h-[350px] sm:w-[440px] sm:h-[440px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary-cyan/15 animate-[spin_30s_linear_infinite] pointer-events-none" />
            <div className="absolute w-[310px] h-[310px] sm:w-[390px] sm:h-[390px] lg:w-[430px] lg:h-[430px] rounded-full border border-dashed border-primary-purple/20 animate-[spin_22s_linear_infinite_reverse] pointer-events-none" />

            {/* Siva's Real Cutout Image Container with Floating Animation */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: [0, -8, 0],
                scale: 1,
                rotate: [0, -0.4, 0.4, 0],
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                scale: { duration: 0.8, ease: "easeOut" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
              }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-[320px] sm:w-[380px] md:w-[430px] lg:w-[470px] flex items-end justify-center pointer-events-none"
            >
              {/* High-Resolution Cutout */}
              <img
                src="/images/profile_nobg_portrait.png"
                alt="Siva - AI/ML Engineer Trainee at Assimilate Technologies"
                className="w-full max-h-[460px] sm:max-h-[520px] lg:max-h-[580px] object-contain drop-shadow-[0_15px_30px_rgba(0,240,255,0.4)] drop-shadow-[0_30px_60px_rgba(176,38,255,0.3)] pointer-events-auto transition-transform duration-300 hover:scale-[1.02]"
              />

              {/* Sci-Fi Hologram Scanner Laser Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  y: ["-10%", "110%"],
                  opacity: [0, 0.85, 0.85, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                  delay: 1.3,
                }}
                className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary-cyan to-transparent shadow-[0_0_15px_#00f0ff] pointer-events-none"
              />

              {/* Diagonal Light Sweep */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  x: ["-120%", "220%"],
                  opacity: [0, 0.35, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                  delay: 1.6,
                }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
