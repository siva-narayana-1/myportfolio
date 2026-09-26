"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  bio: string;
  profileImage?: string;
  resumeUrl?: string;
  location?: string;
  socialLinks?: Record<string, string>;
};

export function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setError(null);
      await adminApi.updateProfile(profile.id, formData);
      await fetchProfile();
      alert("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-slate-700 text-white p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-slate-700 text-white p-2 rounded"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
