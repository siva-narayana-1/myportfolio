"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from "lucide-react";
import { portfolioData } from "@/lib/data";

type Skill = {
  id?: string;
  category: string;
  items: string[];
  order_index: number;
};

export function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<Skill>({
    category: "",
    items: [],
    order_index: 0
  });
  const [itemInput, setItemInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
      const mapped = portfolioData.skills.map((s, i) => ({ ...s, order_index: i }));
      setSkills(mapped);
    } else if (!data || data.length === 0) {
      console.log("No skills found in DB, using fallback data.");
      const mapped = portfolioData.skills.map((s, i) => ({ ...s, order_index: i }));
      setSkills(mapped);
    } else {
      console.log("Fetched skills from Supabase:", data.length);
      setSkills(data as Skill[]);
    }
    setLoading(false);
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData(skill);
    } else {
      setEditingSkill(null);
      setFormData({
        category: "",
        items: [],
        order_index: skills.length + 1
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleItemAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && itemInput.trim()) {
      e.preventDefault();
      if (!formData.items.includes(itemInput.trim())) {
        setFormData({
          ...formData,
          items: [...formData.items, itemInput.trim()]
        });
      }
      setItemInput("");
    }
  };

  const removeItem = (item: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(i => i !== item)
    });
  };

  const seedDatabase = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const dbPayloads = portfolioData.skills.map((s, i) => ({
        category: s.category,
        items: s.items,
        order_index: i
      }));
      
      const { error } = await supabase.from('skills').insert(dbPayloads);
      if (error) throw error;
      
      alert("Database seeded successfully!");
      await fetchSkills();
    } catch (err: any) {
      console.error("Seed error:", err);
      setError("Failed to seed database: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Auto-add pending item if user forgot to press Enter
      const finalItems = [...formData.items];
      if (itemInput.trim() && !finalItems.includes(itemInput.trim())) {
        finalItems.push(itemInput.trim());
      }

      if (editingSkill?.id) {
        const { error } = await supabase
          .from('skills')
          .update({
            category: formData.category,
            items: finalItems,
            order_index: formData.order_index
          })
          .eq('id', editingSkill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([{
            category: formData.category,
            items: finalItems,
            order_index: formData.order_index
          }]);
        if (error) throw error;
      }
      setItemInput(""); // Clear input
      await fetchSkills();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error (Skills):", err);
      setError(err.message || "Failed to save skill category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this skill category?")) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchSkills();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-foreground/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
        Fetching skills...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-4 mb-6">
        {(skills.length === 0 || !skills[0].id) && (
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
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.id || skill.category} className="glass-panel p-6 rounded-xl border border-white/5 group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">{skill.category}</h3>
              <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(skill)} className="p-1.5 text-accent-blue hover:bg-accent-blue/10 rounded-md">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.items.map(item => (
                <span key={item} className="px-3 py-1 bg-surface rounded-full text-sm border border-white/5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">{editingSkill ? 'Edit Category' : 'Add Category'}</h2>
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

              <form id="skill-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan"
                    placeholder="e.g., AI/ML"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Skills (Press Enter to add)</label>
                  <div className="p-3 bg-surface/50 border border-white/10 rounded-lg focus-within:border-primary-cyan">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.items.map(item => (
                        <span key={item} className="text-xs px-2 py-1 bg-primary-cyan/20 text-primary-cyan rounded flex items-center gap-1">
                          {item}
                          <button type="button" onClick={() => removeItem(item)} className="hover:text-white">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={itemInput}
                      onChange={e => setItemInput(e.target.value)}
                      onKeyDown={handleItemAdd}
                      className="w-full bg-transparent focus:outline-none text-sm"
                      placeholder="e.g., Python, TensorFlow..."
                    />
                  </div>
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
                form="skill-form"
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary-cyan text-background font-bold rounded-lg hover:bg-primary-cyan/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
