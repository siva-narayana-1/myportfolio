"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Briefcase,
  Award,
  GraduationCap,
  Settings,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import ProjectsTab from "@/components/admin/ProjectsTab";
import SkillsTab from "@/components/admin/SkillsTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import ProfileTab from "@/components/admin/ProfileTab";
import EducationTab from "@/components/admin/EducationTab";
import MessagesTab from "@/components/admin/MessagesTab";
import SettingsTab from "@/components/admin/SettingsTab";

type TabType =
  | "overview"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "messages"
  | "profile"
  | "settings";

const tabs: Array<{
  id: TabType;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
  { id: "skills", label: "Skills", icon: <Award size={18} /> },
  { id: "experience", label: "Experience", icon: <FileText size={18} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={18} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={18} /> },
  { id: "profile", label: "Profile", icon: <BookOpen size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/admin/login");
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Siva.AI
          </h1>
          <p className="text-slate-400 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "settings" && <SettingsTab />}
        </motion.div>
      </main>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome to your portfolio admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Projects" value="0" icon="📁" />
        <StatCard title="Skills" value="0" icon="🛠️" />
        <StatCard title="Messages" value="0" icon="💬" />
        <StatCard title="Views" value="0" icon="👁️" />
      </div>

      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 text-left hover:bg-cyan-500/30 transition-colors">
            <div className="font-bold">Add Project</div>
            <div className="text-sm text-slate-400">Create a new project</div>
          </button>
          <button className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left hover:bg-blue-500/30 transition-colors">
            <div className="font-bold">Update Profile</div>
            <div className="text-sm text-slate-400">Edit your information</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
