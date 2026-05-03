"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { supabase } from "@/lib/supabase";

type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
};

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setExperiences(data);
      } else {
        setExperiences(portfolioData.experience);
      }
      setLoading(false);
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
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-cyan via-primary-purple to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {loading ? (
              <div className="py-12 flex justify-center items-center text-foreground/50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
                Retrieving journey data...
              </div>
            ) : experiences.map((exp, index) => (
              <motion.div
                key={exp.id || exp.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-surface border-2 border-primary-cyan transform -translate-x-1/2 mt-1.5 z-10" />

                {/* Date Mobile */}
                <div className="pl-12 md:hidden text-primary-cyan font-mono text-sm font-bold">
                  {exp.period}
                </div>

                {/* Content */}
                <div className="pl-12 md:pl-0 w-full md:w-1/2 md:px-8">
                  <div className={`glass-panel p-6 rounded-2xl hover:border-primary-cyan/30 transition-colors ${
                    index % 2 === 0 ? "md:text-left" : "md:text-right"
                  }`}>
                    <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                    <h4 className="text-lg text-foreground/80 mb-4">{exp.company}</h4>
                    <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Date Desktop */}
                <div className={`hidden md:block w-1/2 md:px-8 pt-6 font-mono text-sm font-bold ${
                  index % 2 === 0 ? "text-right text-primary-cyan" : "text-left text-primary-purple"
                }`}>
                  {exp.period}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
