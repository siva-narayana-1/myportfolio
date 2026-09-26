"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Skill = {
  id?: string;
  category: string;
  name: string;
  level?: string;
};

export default function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Skill>({
    category: "",
    name: "",
    level: "Intermediate",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/skills`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData(skill);
    } else {
      setEditingSkill(null);
      setFormData({ category: "", name: "", level: "Intermediate" });
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = editingSkill
        ? `${apiUrl}/api/admin/skills/${editingSkill.id}`
        : `${apiUrl}/api/admin/skills`;

      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchSkills();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save skill");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Delete this skill?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/skills/${id}`, { method: "DELETE" });
      await fetchSkills();
    } catch (err) {
      setError("Failed to delete");
    }
  };

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-slate-400 mt-1">Manage your technical skills</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-slate-400">No skills yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 text-cyan-400">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-slate-700/50 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:border-cyan-500/30 transition-colors group"
                    >
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-xs text-slate-400">{skill.level}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(skill)}
                          className="p-1 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
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
              className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-bold">
                  {editingSkill ? "Edit Skill" : "Add Skill"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="m-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="ML/AI">ML/AI</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    placeholder="e.g., React, Python, Docker"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

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

