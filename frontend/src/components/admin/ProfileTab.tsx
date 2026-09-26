"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, Loader } from "lucide-react";

type Profile = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  title: string;
  bio: string;
  profileImage?: string;
  resumeUrl?: string;
  location?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export default function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    profileImage: "",
    resumeUrl: "",
    location: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = profile
        ? `${apiUrl}/api/admin/profile/${profile.id}`
        : `${apiUrl}/api/admin/profile`;

      const method = profile ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchProfile();
      setSuccess("Profile saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About You</h1>
        <p className="text-slate-400 mt-1">
          Manage your profile information and social links
        </p>
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            âœ“ {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Full Stack Developer, AI Engineer, etc."
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white min-h-[120px]"
              placeholder="Tell us about yourself, your interests, and what you do..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image URL</label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.value })
                }
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resume URL</label>
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, resumeUrl: e.target.value })
                }
                className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <input
                  type="url"
                  value={formData.socialLinks?.github || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        github: e.target.value,
                      },
                    })
                  }
                  placeholder="https://github.com/username"
                  className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks?.linkedin || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="url"
                  value={formData.socialLinks?.twitter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="https://twitter.com/username"
                  className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

