"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Code2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Eye,
  Activity,
  Layers,
  Terminal,
  Cpu
} from "lucide-react";
import { GithubIcon } from "./Icons";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  metrics: string;
  image: string;
  link: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(apiUrl + "/api/portfolio/projects");
        const data = await response.json();
        // Filter out placeholder URLs so browser never attempts failed requests
        const cleanedData = (data || []).map((p: Project) => ({
          ...p,
          image: p.image && p.image.includes("via.placeholder.com") ? "" : p.image,
        }));
        setProjects(cleanedData);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Reset image error state whenever current project changes
  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  // Auto-scroll carousel timer (auto-advances every 4.5 seconds, pauses on hover)
  useEffect(() => {
    if (projects.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [projects.length, isPaused]);

  const handleNext = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  // Helper to render contextual icons and domain badges
  const getProjectVisual = (project?: Project) => {
    if (!project) return { icon: <Code2 size={40} />, category: "AI & Software System", color: "primary-cyan" };

    const text = (project.title + " " + project.techStack.join(" ")).toLowerCase();

    if (text.includes("vision") || text.includes("video") || text.includes("monitoring") || text.includes("waste") || text.includes("yolo")) {
      return {
        icon: <Eye size={42} className="text-primary-cyan animate-pulse drop-shadow-[0_0_15px_#00f0ff]" />,
        category: "Computer Vision & Video Analytics",
        color: "text-primary-cyan",
      };
    }
    if (text.includes("rag") || text.includes("chatbot") || text.includes("content") || text.includes("gpt") || text.includes("llm")) {
      return {
        icon: <Brain size={42} className="text-primary-purple animate-pulse drop-shadow-[0_0_15px_#b026ff]" />,
        category: "Generative AI & LLM Systems",
        color: "text-primary-purple",
      };
    }
    if (text.includes("medflow") || text.includes("clinical") || text.includes("health")) {
      return {
        icon: <Activity size={42} className="text-accent-blue animate-pulse drop-shadow-[0_0_15px_#3b82f6]" />,
        category: "AI Clinical Intelligence & NLP",
        color: "text-accent-blue",
      };
    }
    if (text.includes("food") || text.includes("classifier")) {
      return {
        icon: <Layers size={42} className="text-primary-cyan animate-pulse drop-shadow-[0_0_15px_#00f0ff]" />,
        category: "Deep Learning & Vision Metadata",
        color: "text-primary-cyan",
      };
    }

    return {
      icon: <Cpu size={42} className="text-primary-cyan animate-pulse drop-shadow-[0_0_15px_#00f0ff]" />,
      category: "Full Stack & Edge Intelligence",
      color: "text-primary-cyan",
    };
  };

  const visual = getProjectVisual(currentProject);

  const isValidImage =
    !imageError &&
    currentProject?.image &&
    !currentProject.image.includes("placeholder") &&
    (currentProject.image.startsWith("/") || currentProject.image.startsWith("http"));

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-cyan/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 max-w-7xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Systems</span>
          </h2>
          <div className="w-24 h-1 bg-accent-blue md:mx-auto rounded-full mb-5" />
          <p className="text-foreground/60 max-w-2xl mx-auto text-sm sm:text-base">
            Real-world deployments, complex pipelines, and AI models built to solve actual problems.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-16 flex justify-center items-center text-foreground/50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3" />
            Loading systems...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-foreground/50">No projects found</div>
        ) : (
          <div
            className="relative px-2 sm:px-6 md:px-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Left Floating Arrow Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous Project"
              className="absolute -left-3 sm:-left-6 md:-left-8 lg:-left-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-950/95 border border-primary-cyan/60 text-primary-cyan hover:text-white hover:bg-primary-cyan/35 hover:border-primary-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] active:scale-90 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-2xl"
              title="Previous Project"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Floating Arrow Button */}
            <button
              onClick={handleNext}
              aria-label="Next Project"
              className="absolute -right-3 sm:-right-6 md:-right-8 lg:-right-10 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-950/95 border border-primary-cyan/60 text-primary-cyan hover:text-white hover:bg-primary-cyan/35 hover:border-primary-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] active:scale-90 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-2xl"
              title="Next Project"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Project Display Card */}
            <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="grid md:grid-cols-12 gap-8 items-center"
                >
                  {/* Left Side - Image / System Visualizer */}
                  <div className="md:col-span-6 space-y-4">
                    {/* Visualizer Box */}
                    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden group bg-surface border border-white/10 shadow-inner">
                      <div className="absolute inset-0 bg-primary-cyan/10 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay pointer-events-none" />

                      {isValidImage ? (
                        <img
                          src={currentProject.image}
                          alt={currentProject.title}
                          onError={() => setImageError(true)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-surface to-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                          {/* Background Cyber Grid inside visualizer */}
                          <div
                            className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(0,240,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.25)_1px,transparent_1px)]"
                            style={{ backgroundSize: "20px 20px" }}
                          />

                          {/* Corner HUD Brackets */}
                          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-primary-cyan/50" />
                          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary-cyan/50" />
                          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary-purple/50" />
                          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-primary-purple/50" />

                          {/* Top Status HUD */}
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5 text-[9px] font-mono text-foreground/60 tracking-wider">
                            <Terminal size={10} className="text-primary-cyan" />
                            <span>DEPLOYMENT // ACTIVE</span>
                          </div>

                          {/* Center Icon */}
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-3 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-md relative z-10">
                            {visual.icon}
                          </div>

                          <h4 className="text-lg sm:text-xl font-bold text-foreground relative z-10 tracking-tight">
                            {currentProject.title}
                          </h4>

                          <p className="text-xs font-mono text-primary-cyan/80 mt-1.5 flex items-center gap-1.5 relative z-10">
                            <Sparkles size={11} className="text-primary-cyan" />
                            <span>{visual.category}</span>
                          </p>

                          {currentProject.metrics && (
                            <div className="mt-2.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-foreground/60 relative z-10">
                              {currentProject.metrics}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="overflow-x-auto pb-1.5 scrollbar-none">
                      <div className="flex gap-2 flex-wrap">
                        {currentProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-3 py-1 bg-primary-purple/10 text-primary-purple rounded-full border border-primary-purple/20 whitespace-nowrap shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Description and Links */}
                  <div className="md:col-span-6 space-y-5 flex flex-col justify-between h-full">
                    {/* Top Row: Featured Badge + Project Counter */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-2 text-primary-cyan text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                        <Code2 size={14} />
                        <span>FEATURED SYSTEM</span>
                      </div>
                      <div className="text-xs font-mono text-foreground/50 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                        <span className="text-primary-cyan font-bold">{currentIndex + 1}</span>
                        {" / "}
                        <span>{projects.length}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        {currentProject.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="text-foreground/75 text-sm sm:text-base leading-relaxed">
                      <p>{currentProject.description}</p>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap gap-3.5 pt-2">
                      {currentProject.link && currentProject.link !== "#" ? (
                        <a
                          href={currentProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-cyan/15 border border-primary-cyan/40 text-primary-cyan hover:bg-primary-cyan hover:text-slate-950 font-medium rounded-xl transition-all shadow-sm"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      ) : (
                        <div
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface/50 border border-white/10 text-foreground/40 rounded-xl cursor-not-allowed text-sm"
                          title="Not available for public deployment"
                        >
                          <ExternalLink size={16} />
                          <span>No deployment</span>
                        </div>
                      )}
                      <a
                        href="https://github.com/siva-narayana-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-purple/15 border border-primary-purple/40 text-primary-purple hover:bg-primary-purple hover:text-white font-medium rounded-xl transition-all shadow-sm"
                      >
                        <GithubIcon size={16} />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Progress Indicators (Auto-Scroll Dots) */}
            <div className="flex gap-2 justify-center mt-8">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex
                      ? "bg-primary-cyan w-8 shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                      : "bg-white/20 w-2 hover:bg-white/40"
                  }`}
                  title={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
