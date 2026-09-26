"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Skill = {
  id: string;
  category: string;
  name: string;
  level: string;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/portfolio/skills`);
        const data = await response.json();
        setSkills(data || []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 relative bg-surface-hover/30">
      <div className="container mx-auto px-6 z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide">
            Technical Skills
          </h2>
          <div className="h-px bg-foreground/20 rounded-full" />
        </motion.div>

        <div className="space-y-4">
          {loading ? (
             <div className="py-12 flex justify-center items-center text-foreground/50">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
               Synchronizing arsenal...
             </div>
          ) : !Array.isArray(skills) || skills.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">No skills found</div>
          ) : Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, Skill[]>)
            ).map(([category, categorySkills], groupIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              className="flex gap-4"
            >
              <span className="text-primary-cyan mt-1">•</span>
              <div>
                <span className="font-bold text-foreground">
                  {category}:
                </span>
                <span className="text-foreground/80 ml-2">
                  {categorySkills.map((skill) => skill.name).join(", ")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
