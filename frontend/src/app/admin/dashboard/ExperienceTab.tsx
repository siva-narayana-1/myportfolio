"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

type Experience = {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location?: string;
  current?: boolean;
};

export function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getExperience();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      if (editingId) {
        await adminApi.updateExperience(editingId, formData);
      } else {
        await adminApi.createExperience(formData);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      await fetchExperiences();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await adminApi.deleteExperience(id);
      await fetchExperiences();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => {
          setEditingId(null);
          setFormData({});
          setIsModalOpen(true);
        }}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Plus size={18} /> Add Experience
      </button>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-slate-800 p-4 rounded flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white">{exp.position}</h3>
                <p className="text-gray-300">{exp.company}</p>
                <p className="text-sm text-gray-400">{exp.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(exp.id);
                    setFormData(exp);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit" : "Add"} Experience</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Position"
              value={formData.position || ""}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company || ""}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={formData.startDate ? formData.startDate.split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />

            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center justify-center gap-2">
                <Save size={18} /> Save
              </button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
