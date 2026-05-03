"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, AlertCircle } from "lucide-react";
import { portfolioData } from "@/lib/data";

type Profile = {
  id?: string;
  name: string;
  role: string;
  tagline: string;
  summary: string;
  email: string;
  github: string;
  linkedin: string;
};

export function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      // Fallback to initial if empty
      setProfile({
        name: portfolioData.user.name,
        role: portfolioData.user.role,
        tagline: portfolioData.user.tagline,
        summary: portfolioData.user.summary,
        email: portfolioData.user.contact.email,
        github: portfolioData.user.contact.github,
        linkedin: portfolioData.user.contact.linkedin,
      });
    } else {
      setProfile(data as Profile);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (profile.id) {
        const { error } = await supabase
          .from('profile')
          .update({
            name: profile.name,
            role: profile.role,
            tagline: profile.tagline,
            summary: profile.summary,
            email: profile.email,
            github: profile.github,
            linkedin: profile.linkedin,
          })
          .eq('id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profile')
          .insert([{
            name: profile.name,
            role: profile.role,
            tagline: profile.tagline,
            summary: profile.summary,
            email: profile.email,
            github: profile.github,
            linkedin: profile.linkedin,
          }]);
        if (error) throw error;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-12 flex justify-center items-center text-foreground/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-cyan mr-3"></div>
        Fetching profile data...
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-xl border border-white/5 max-w-4xl">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
          <p>Profile updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Role / Title</label>
            <input 
              type="text" 
              required
              value={profile.role}
              onChange={e => setProfile({...profile, role: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">Hero Tagline</label>
          <input 
            type="text" 
            required
            value={profile.tagline}
            onChange={e => setProfile({...profile, tagline: e.target.value})}
            className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-1">About Summary</label>
          <textarea 
            required
            value={profile.summary}
            onChange={e => setProfile({...profile, summary: e.target.value})}
            className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors min-h-[120px] resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={profile.email}
              onChange={e => setProfile({...profile, email: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">GitHub URL</label>
            <input 
              type="url" 
              required
              value={profile.github}
              onChange={e => setProfile({...profile, github: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">LinkedIn URL</label>
            <input 
              type="url" 
              required
              value={profile.linkedin}
              onChange={e => setProfile({...profile, linkedin: e.target.value})}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-cyan transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-cyan text-background font-bold rounded-lg hover:bg-primary-cyan/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <span className="animate-pulse">Saving...</span> : <><Save size={18} /><span>Save Profile</span></>}
          </button>
        </div>
      </form>
    </div>
  );
}
