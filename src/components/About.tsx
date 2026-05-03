"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Cpu, Network, Database } from "lucide-react";

export default function About() {
  const { profile } = useProfile();
  
  const highlights = [
    {
      icon: <Cpu className="text-primary-cyan w-8 h-8" />,
      title: "AI & Data Science",
      desc: "Deep background in training and evaluating complex neural networks."
    },
    {
      icon: <Network className="text-primary-purple w-8 h-8" />,
      title: "End-to-End Systems",
      desc: "Building scalable backend pipelines from inference to deployment."
    },
    {
      icon: <Database className="text-accent-blue w-8 h-8" />,
      title: "LLM & RAG",
      desc: "Architecting custom knowledge retrieval systems using local & cloud LLMs."
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-primary-cyan md:mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-cyan/10 rounded-full blur-3xl" />
            <p className="text-lg text-foreground/80 leading-relaxed relative z-10">
              {profile.summary}
            </p>
          </motion.div>

          <div className="grid gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-6 glass-panel rounded-2xl border border-white/5 hover:border-primary-cyan/30 transition-colors group"
              >
                <div className="p-3 rounded-lg bg-surface group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
