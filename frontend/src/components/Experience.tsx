"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Experience = {
  id: string;
  position: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
};

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/portfolio/experience`);
        const data = await response.json();
        setExperiences(data || []);
      } catch (error) {
        console.error("Failed to fetch experience:", error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 relative bg-surface-hover/30">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <div className="w-24 h-1 bg-primary-cyan md:mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-cyan via-primary-purple to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {loading ? (
              <div className="py-12 flex justify-center items-center text-foreground/50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
                Retrieving journey data...
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-12 text-foreground/50">No experience data</div>
            ) : (
              experiences.map((exp, index) => {
                const startDate = new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" });
                const endDate = exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Present";
                const period = startDate + " - " + endDate;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={isEven ? "relative flex flex-col md:flex-row-reverse gap-8" : "relative flex flex-col md:flex-row gap-8"}
                  >
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-surface border-2 border-primary-cyan transform -translate-x-1/2 mt-1.5 z-10" />

                    <div className="pl-12 md:hidden text-primary-cyan font-mono text-sm font-bold">
                      {period}
                    </div>

                    <div className="pl-12 md:pl-0 w-full md:w-1/2 md:px-8">
                      <div className="glass-panel p-6 rounded-2xl hover:border-primary-cyan/30 transition-colors">
                        <h3 className="text-2xl font-bold mb-1">{exp.position}</h3>
                        <h4 className="text-lg text-foreground/80 mb-4">{exp.company}</h4>
                        <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                          {exp.description}
                        </p>
                      </div>
                    </div>

                    <div className={isEven ? "hidden md:block w-1/2 md:px-8 pt-6 font-mono text-sm font-bold text-right text-primary-cyan" : "hidden md:block w-1/2 md:px-8 pt-6 font-mono text-sm font-bold text-left text-primary-purple"}>
                      {period}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
