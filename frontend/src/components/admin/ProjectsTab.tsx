"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader } from "lucide-react";

type Project = {
  id?: string;
  title: string;
  description: string;
  image?: string;
  techStack: string[];
  link?: string;
  github?: string;
  metrics?: string;
  featured?: boolean;
};

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    techStack: [],
    image: "",
    link: "",
    github: "",
    metrics: "",
    featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(apiUrl + "/api/admin/projects", {
        headers: { "Authorization": "Bearer " + token }
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
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
        image: "",
        link: "",
        github: "",
        metrics: "",
        featured: false,
      });
    }
    setError("");
    setIsModalOpen(true);
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, techInput.trim()],
        });
        setTechInput("");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const finalTech = [...formData.techStack];
      if (techInput.trim() && !finalTech.includes(techInput.trim())) {
        finalTech.push(techInput.trim());
      }

      const payload = {
        ...formData,
        techStack: finalTech,
      };

      const token = localStorage.getItem("auth_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = editingProject
        ? apiUrl + "/api/admin/projects/" + editingProject.id
        : apiUrl + "/api/admin/projects";

      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + (token || "")
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchProjects();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Delete this project?")) return;

    try {
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(apiUrl + "/api/admin/projects/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      await fetchProjects();
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-slate-400 mt-1">Showcase your best work</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-slate-400">No projects yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors group"
            >
              {project.image && (
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-cyan-500/30 text-cyan-300 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(project)}
                    className="flex-1 p-2 text-sm text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                  >
                    <Edit2 size={16} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 p-2 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-slate-800">
                <h2 className="text-xl font-bold">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="m-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white min-h-[100px] resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Project Image</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            setFormData({ ...formData, image: evt.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white file:bg-cyan-500/20 file:border-0 file:rounded file:px-3 file:py-1 file:text-cyan-300 file:cursor-pointer"
                    />
                    {formData.image && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-16 h-16 rounded bg-slate-700 overflow-hidden">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL (alternative)</label>
                    <input
                      type="url"
                      value={formData.image && formData.image.startsWith("http") ? formData.image : ""}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                      placeholder="Or paste an image URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Link</label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GitHub Link</label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData({ ...formData, github: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tech Stack</label>
                  <div className="p-3 bg-slate-700 border border-white/10 rounded-lg">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-cyan-500/30 text-cyan-300 rounded flex items-center gap-1"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTech(tech)}
                            className="hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={addTech}
                      className="w-full bg-transparent focus:outline-none text-sm"
                      placeholder="Type tech and press Enter..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Impact Metrics</label>
                  <input
                    type="text"
                    value={formData.metrics}
                    onChange={(e) =>
                      setFormData({ ...formData, metrics: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    placeholder="e.g., 40% performance improvement"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Featured Project</span>
                </label>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
