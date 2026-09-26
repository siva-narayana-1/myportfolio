"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, Loader } from "lucide-react";

type Settings = {
  id?: string;
  siteName: string;
  siteDescription: string;
  keywords?: string;
  siteUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
};

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<Settings>({
    siteName: "",
    siteDescription: "",
    keywords: "",
    siteUrl: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/settings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data);
      setFormData(data);
    } catch (err) {
      setError("Failed to load settings");
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
      const url = settings
        ? `${apiUrl}/api/admin/settings/${settings.id}`
        : `${apiUrl}/api/admin/settings`;

      const method = settings ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchSettings();
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
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
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-slate-400 mt-1">Manage your portfolio's global settings</p>
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
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              required
              value={formData.siteName}
              onChange={(e) =>
                setFormData({ ...formData, siteName: e.target.value })
              }
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea
              required
              value={formData.siteDescription}
              onChange={(e) =>
                setFormData({ ...formData, siteDescription: e.target.value })
              }
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SEO Keywords</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              placeholder="Separate with commas: developer, portfolio, react..."
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site URL</label>
            <input
              type="url"
              value={formData.siteUrl}
              onChange={(e) =>
                setFormData({ ...formData, siteUrl: e.target.value })
              }
              placeholder="https://yourportfolio.com"
              className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors text-white"
            />
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

