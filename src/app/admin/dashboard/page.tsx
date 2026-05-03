"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { LogOut, Plus, Edit2, Trash2, Layers, Cpu, Code, Settings, X, Save, AlertCircle, Briefcase } from "lucide-react";
import { portfolioData } from "@/lib/data";
import { ProfileTab } from "./ProfileTab";
import { SkillsTab } from "./SkillsTab";
import { ExperienceTab } from "./ExperienceTab";

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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    techStack: [],
    metrics: "",
    image: "",
    link: "",
    labels: []
  });
  const [techInput, setTechInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seedDatabase = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dbPayloads = portfolioData.projects.map((p) => ({
        title: p.title,
        description: p.description,
        tech_stack: p.techStack,
        metrics: p.metrics,
        image: p.image,
        link: p.link,
        labels: []
      }));
      
      const { error } = await supabase.from('projects').insert(dbPayloads);
      if (error) throw error;
      
      alert("Projects database seeded successfully!");
      await fetchProjects();
    } catch (err: any) {
      console.error("Seed error:", err);
      setError("Failed to seed projects: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, redirecting to login...");
        router.push("/admin/login");
        return;
      }
      console.log("Session active:", session.user.email);
      fetchProjects();
    };
    checkUser();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching projects:", error);
      // Fallback to local data if DB is not setup
      if (projects.length === 0) setProjects(portfolioData.projects);
    } else if (data) {
      // Map tech_stack to techStack
      const mappedData = data.map(p => ({
        ...p,
        techStack: p.tech_stack || [],
        labels: p.labels || []
      }));
      setProjects(mappedData);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        techStack: [],
        metrics: "",
        image: "",
        link: ""
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleTechStackAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, techInput.trim()]
        });
      }
      setTechInput("");
    }
  };

  const handleLabelAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault();
      const currentLabels = formData.labels || [];
      if (!currentLabels.includes(labelInput.trim())) {
        setFormData({
          ...formData,
          labels: [...currentLabels, labelInput.trim()]
        });
      }
      setLabelInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== tech)
    });
  };

  const removeLabel = (label: string) => {
    setFormData({
      ...formData,
      labels: (formData.labels || []).filter(l => l !== label)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Auto-add pending tech if user forgot to press Enter
      const finalTech = [...formData.techStack];
      if (techInput.trim() && !finalTech.includes(techInput.trim())) {
        finalTech.push(techInput.trim());
      }

      const dbPayload = {
        title: formData.title,
        description: formData.description,
        tech_stack: finalTech,
        metrics: formData.metrics,
        image: formData.image,
        link: formData.link,
        labels: formData.labels || []
      };

      if (editingProject?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('projects')
          .update(dbPayload)
          .eq('id', editingProject.id);
        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('projects')
          .insert([dbPayload]);
        if (insertError) throw insertError;
      }

      await fetchProjects();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      await fetchProjects();
    } catch (err: any) {
      alert("Error deleting project: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-white/5 flex flex-col z-20">
        <div className="p-6 border-b border-white/5">
          <span className="text-2xl font-bold gradient-text tracking-tighter">
            Siva.AI
          </span>
          <span className="ml-2 text-xs font-mono px-2 py-0.5 bg-primary-cyan/20 text-primary-cyan rounded-full">
            ADMIN
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "projects", label: "Projects", icon: <Layers size={18} /> },
            { id: "skills", label: "Skills", icon: <Cpu size={18} /> },
            { id: "experience", label: "Experience", icon: <Briefcase size={18} /> },
            { id: "about", label: "About", icon: <Code size={18} /> },
            { id: "settings", label: "Settings", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === item.id 
                  ? "bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20" 
                  : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-left"
          >
            <LogOut size={18} />
            <span className="font-medium">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground capitalize">{activeTab}</h1>
            <p className="text-foreground/50 text-sm mt-1">Manage your portfolio data</p>
          </div>
          
          {activeTab === "projects" && (
            <div className="flex gap-4">
              {(projects.length === 0 || !projects[0].id) && (
                <button 
                  onClick={seedDatabase}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 border border-primary-cyan/30 text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-colors text-sm"
                >
                  <Save size={16} />
                  <span>Seed DB from Static</span>
                </button>
              )}
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-cyan text-background font-bold rounded-lg hover:bg-primary-cyan/90 transition-colors"
              >
                <Plus size={18} />
                <span>Add New</span>
              </button>
            </div>
          )}
        </header>

        {/* Dynamic Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-12 flex justify-center items-center text-foreground/50">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
                  Fetching data from Supabase...
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-foreground/50 glass-panel rounded-xl">
                  No projects found. Add one to get started.
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id || project.title} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-primary-cyan/30 transition-colors group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl truncate pr-4" title={project.title}>{project.title}</h3>
                      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => openModal(project)} className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-md transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-foreground/60 text-sm mb-4 line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-xs font-mono px-2 py-1 bg-surface rounded-md border border-white/5">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-xs font-mono px-2 py-1 bg-surface rounded-md border border-white/5">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "about" && <ProfileTab />}
          
          {activeTab === "settings" && (
            <div className="glass-panel p-8 rounded-xl border border-white/5">
              <p className="text-foreground/60">Global configuration, SEO, and integration settings (like OpenAI API key for auto-generation).</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-8 relative"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                <h2 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/5">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form id="project-form" onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
                      placeholder="e.g., MedFlow (AI Clinical System)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-1">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors min-h-[100px] resize-y"
                      placeholder="Detailed project description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-1">Impact Metrics</label>
                    <input 
                      type="text" 
                      value={formData.metrics}
                      onChange={e => setFormData({...formData, metrics: e.target.value})}
                      className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
                      placeholder="e.g., Reduced clinical documentation time by 40%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-1">Tech Stack (Press Enter to add)</label>
                    <div className="p-3 bg-surface/50 border border-white/10 rounded-lg focus-within:border-primary-cyan transition-colors">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.techStack.map(tech => (
                          <span key={tech} className="text-xs font-mono px-2 py-1 bg-primary-purple/20 text-primary-purple rounded-md flex items-center gap-1">
                            {tech}
                            <button type="button" onClick={() => removeTech(tech)} className="hover:text-white transition-colors">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={handleTechStackAdd}
                        className="w-full bg-transparent focus:outline-none text-sm"
                        placeholder="e.g., React, Python, YOLOv7..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-1">Image URL</label>
                      <input 
                        type="url" 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-1">Project Link</label>
                      <input 
                        type="url" 
                        value={formData.link}
                        onChange={e => setFormData({...formData, link: e.target.value})}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground/70 mb-1">Visibility Labels / Permissions (Press Enter)</label>
                    <div className="p-3 bg-surface/50 border border-white/10 rounded-lg focus-within:border-primary-cyan transition-colors">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(formData.labels || []).map(label => (
                          <span key={label} className="text-xs font-mono px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded-md flex items-center gap-1">
                            {label}
                            <button type="button" onClick={() => removeLabel(label)} className="hover:text-white transition-colors">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        value={labelInput}
                        onChange={e => setLabelInput(e.target.value)}
                        onKeyDown={handleLabelAdd}
                        className="w-full bg-transparent focus:outline-none text-sm"
                        placeholder="e.g., Public, Internal, Admin Only..."
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-white/10 shrink-0 flex justify-end gap-4 bg-background/50 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  form="project-form"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary-cyan text-background font-bold rounded-lg hover:bg-primary-cyan/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="animate-pulse">Saving...</span>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingProject ? 'Update Project' : 'Save Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
