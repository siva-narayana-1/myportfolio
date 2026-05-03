"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Login successful, redirecting...");
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to authenticate. Check your credentials or Supabase keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-cyan/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-purple/10 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 glass-panel rounded-2xl relative z-10 border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-2xl font-bold gradient-text tracking-tighter cursor-pointer inline-block mb-2">
              Siva.AI
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-foreground/50 text-sm mt-1">Secure System Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              System Identifier (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-cyan transition-colors text-foreground"
                placeholder="admin@sivabio.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Security Key (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary-purple transition-colors text-foreground"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <span>Initialize Session</span>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-foreground/40 font-mono">
          <p>Login with your Supabase Auth account</p>
        </div>
      </motion.div>
    </div>
  );
}
