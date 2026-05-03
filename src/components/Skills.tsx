"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { supabase } from "@/lib/supabase";

type Skill = {
  category: string;
  items: string[];
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from('skills')
        .select('category, items')
        .order('order_index', { ascending: true });

      if (data && !error && data.length > 0) {
        setSkills(data);
      } else {
        setSkills(portfolioData.skills);
      }
      setLoading(false);
    }
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 relative bg-surface-hover/30">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <div className="w-24 h-1 bg-primary-purple md:mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full py-12 flex justify-center items-center text-foreground/50">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
               Synchronizing arsenal...
             </div>
          ) : skills.map((skillGroup, groupIndex) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              className="glass-panel p-8 rounded-2xl border-t border-primary-cyan/20"
            >
              <h3 className="text-xl font-bold mb-6 text-primary-cyan">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillGroup.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 bg-surface text-sm font-medium rounded-md border border-white/5 shadow-sm hover:border-primary-cyan/50 hover:text-primary-cyan transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
