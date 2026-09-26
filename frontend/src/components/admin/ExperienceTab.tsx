"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Experience = {
  id?: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  current?: boolean;
};

export default function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Experience>({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    current: false,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/experience`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      setError("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData(exp);
    } else {
      setEditingExp(null);
      setFormData({
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        current: false,
      });
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
      const url = editingExp
        ? `${apiUrl}/api/admin/experience/${editingExp.id}`
        : `${apiUrl}/api/admin/experience`;

      const method = editingExp ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchExperiences();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save experience");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Delete this experience?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/experience/${id}`, { method: "DELETE" });
      await fetchExperiences();
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-slate-400 mt-1">Manage your work experience</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-slate-400">No experience yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-sm text-cyan-400">{exp.company}</p>
                  <p className="text-xs text-slate-400 mt-1">{exp.location}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.current
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(exp)}
                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 size={16} />
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
                  {editingExp ? "Edit Experience" : "Add Experience"}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      disabled={formData.current}
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current: e.target.checked,
                        endDate: e.target.checked ? "" : formData.endDate,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Currently working here</span>
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

