"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

type Skill = {
  id: string;
  category: string;
  name: string;
  level: string;
};

export function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      if (editingId) {
        await adminApi.updateSkill(editingId, formData);
      } else {
        await adminApi.createSkill(formData);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      await fetchSkills();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await adminApi.deleteSkill(id);
      await fetchSkills();
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
        <Plus size={18} /> Add Skill
      </button>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-slate-800 p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white">{skill.name}</h3>
                  <p className="text-sm text-gray-400">{skill.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(skill.id);
                      setFormData(skill);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Level: {skill.level}</p>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingId ? "Edit" : "Add"} Skill</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Skill Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-700 text-white p-2 rounded"
            />
            <input
              type="text"
              placeholder="Level"
              value={formData.level || ""}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
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
