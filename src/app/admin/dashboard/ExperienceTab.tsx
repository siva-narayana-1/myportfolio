"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from "lucide-react";
import { portfolioData } from "@/lib/data";

type Experience = {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
  order_index: number;
};

export function ExperienceTab() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Experience>({
    role: "",
    company: "",
    period: "",
    description: "",
    order_index: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const seedDatabase = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dbPayloads = portfolioData.experience.map((e, i) => ({
        role: e.role,
        company: e.company,
        period: e.period,
        description: e.description,
        order_index: i
      }));
      
      const { error } = await supabase.from('experience').insert(dbPayloads);
      if (error) throw error;
      
      alert("Database seeded successfully!");
      await fetchExperiences();
    } catch (err: any) {
      console.error("Seed error:", err);
      setError("Failed to seed database: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching experience:", error);
      const mapped = portfolioData.experience.map((e, i) => ({ ...e, order_index: i }));
      setExperiences(mapped);
    } else if (!data || data.length === 0) {
      console.log("No experience found in DB, using fallback data.");
      const mapped = portfolioData.experience.map((e, i) => ({ ...e, order_index: i }));
      setExperiences(mapped);
    } else {
      console.log("Fetched experience from Supabase:", data.length);
      setExperiences(data as Experience[]);
    }
    setLoading(false);
  };

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData(exp);
    } else {
      setEditingExp(null);
      setFormData({
        role: "",
        company: "",
        period: "",
        description: "",
        order_index: experiences.length + 1
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingExp?.id) {
        const { error } = await supabase
          .from('experience')
          .update({
            role: formData.role,
            company: formData.company,
            period: formData.period,
            description: formData.description,
            order_index: formData.order_index
          })
          .eq('id', editingExp.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experience')
          .insert([{
            role: formData.role,
            company: formData.company,
            period: formData.period,
            description: formData.description,
            order_index: formData.order_index
          }]);
        if (error) throw error;
      }
      await fetchExperiences();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error (Experience):", err);
      setError(err.message || "Failed to save experience");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchExperiences();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-foreground/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
        Fetching experience...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-4 mb-6">
        {(experiences.length === 0 || !experiences[0].id) && (
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
          <span>Add Experience</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id || exp.role} className="glass-panel p-6 rounded-xl border border-white/5 group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(exp)} className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-md">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md">
                <Trash2 size={16} />
              </button>
            </div>
            
            <h3 className="font-bold text-xl text-primary-cyan pr-16">{exp.role}</h3>
            <div className="text-foreground/80 font-medium mt-1">{exp.company}</div>
            <div className="text-foreground/40 text-sm font-mono mt-1 mb-4">{exp.period}</div>
            <p className="text-foreground/60 text-sm leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">{editingExp ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <form id="exp-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Role / Job Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan"
                    placeholder="e.g., Senior AI Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Company</label>
                  <input 
                    type="text" 
                    required
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan"
                    placeholder="e.g., Google"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Time Period</label>
                  <input 
                    type="text" 
                    required
                    value={formData.period}
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan"
                    placeholder="e.g., Jan 2022 - Present"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan min-h-[100px]"
                    placeholder="What did you do there?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Order Index</label>
                  <input 
                    type="number" 
                    required
                    value={formData.order_index}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setFormData({...formData, order_index: isNaN(val) ? 0 : val});
                    }}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg font-medium text-foreground/70 hover:text-foreground"
              >
                Cancel
              </button>
              <button 
                form="exp-form"
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary-cyan text-background font-bold rounded-lg hover:bg-primary-cyan/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
