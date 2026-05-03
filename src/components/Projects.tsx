"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Code2, Activity } from "lucide-react";
import { GithubIcon } from "./Icons";
import Image from "next/image";

type Project = {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  metrics: string;
  image: string;
  link: string;
  labels?: string[];
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error || !data || data.length === 0) {
        // Fallback to static data if not set up
        setProjects(portfolioData.projects);
      } else {
        const mappedData = data.map(p => ({
          ...p,
          techStack: p.tech_stack || [],
          labels: p.labels || []
        }));
        setProjects(mappedData);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Systems</span>
          </h2>
          <div className="w-24 h-1 bg-accent-blue md:mx-auto rounded-full mb-6" />
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Real-world deployments, complex pipelines, and AI models built to solve actual problems.
          </p>
        </motion.div>

        <div className="grid gap-12">
          {loading ? (
             <div className="py-12 flex justify-center items-center text-foreground/50">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
               Loading systems...
             </div>
          ) : projects.map((project, index) => (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Container */}
              <div className="w-full md:w-1/2 relative h-64 md:h-96 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-primary-cyan/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay" />
                <div className="absolute inset-0 border border-white/10 z-20 rounded-2xl" />
                
                {project.image ? (
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-surface flex items-center justify-center">
                    <Activity size={48} className="text-primary-cyan/20" />
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center space-x-2 text-primary-cyan text-sm font-mono font-bold tracking-wider uppercase">
                  <Code2 size={16} />
                  <span>AI Product</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-bold">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.labels?.map(label => (
                      <span key={label} className="px-2 py-0.5 bg-primary-cyan/10 text-primary-cyan text-[10px] font-bold uppercase tracking-tighter rounded border border-primary-cyan/20">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-xl relative">
                  <p className="text-foreground/80 leading-relaxed relative z-10">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs font-mono px-3 py-1 bg-primary-purple/10 text-primary-purple rounded-full border border-primary-purple/20">
                      {tech}
                    </span>
                  ))}
                </div>

                {project.metrics && (
                  <div className="flex items-center gap-4 text-sm font-medium text-foreground/60 border-t border-white/5 pt-4">
                    <Activity size={16} className="text-primary-cyan" />
                    <span>Impact: {project.metrics}</span>
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  {project.link && project.link !== "#" ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-cyan transition-colors">
                      <ExternalLink size={20} />
                      <span>Live Demo</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-foreground/40 cursor-not-allowed" title="Not available for public deployment">
                      <ExternalLink size={20} />
                      <span>No deployment</span>
                    </div>
                  )}
                  <a href={portfolioData.user.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-cyan transition-colors">
                    <GithubIcon size={20} />
                    <span>Source Code</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
