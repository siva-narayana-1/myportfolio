"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const { profile } = useProfile();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-cyan/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-purple/20 rounded-full blur-[120px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          style={{ backgroundSize: '30px 30px' }}
        />
      </div>

      <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >

          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 leading-tight">
            Hi, I'm <br />
            <span className="gradient-text">{profile.name}</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-foreground/80 font-medium mb-6">
            {profile.role}
          </h2>
          
          <p className="text-foreground/60 mb-8 max-w-lg leading-relaxed">
            {profile.tagline}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="#projects"
              className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              View Projects <ArrowRight size={18} />
            </a>
            <a 
              href="/resume/siva_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-8 py-3 glass-panel border border-foreground/10 font-medium rounded-full hover:bg-foreground/5 transition-colors flex items-center gap-2"
            >
              Resume <Download size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-72 h-72 md:w-96 md:h-96"
        >
          {/* Glowing ring behind image */}
          <div className="absolute inset-0 rounded-full border-2 border-primary-cyan/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-[-20px] rounded-full border border-primary-purple/20 animate-[spin_15s_linear_infinite_reverse]" />
          
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-surface shadow-[0_0_50px_rgba(0,240,255,0.2)]">
            <Image
              src="/images/profile.jpg"
              alt="Siva Profile"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
