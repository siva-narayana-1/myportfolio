"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/portfolio/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || `Portfolio Message from ${formData.name}`,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Auto-reset success message after 6 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 6000);
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message. Please try again or email directly.");
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-12 max-w-6xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Initialize <span className="gradient-text">Connection</span>
          </h2>
          <div className="w-24 h-1 bg-primary-purple md:mx-auto rounded-full mb-4" />
          <p className="text-foreground/60 max-w-lg mx-auto text-sm sm:text-base">
            Have a project in mind, an opportunity to discuss, or want to collaborate on AI and software systems?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info & Profiles */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-5 space-y-6"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles size={18} className="text-primary-cyan" />
                Let's Build Together
              </h3>
              <p className="text-foreground/70 text-sm sm:text-base leading-relaxed">
                Open for high-impact AI/ML engineering roles, intelligent system deployments, and cutting-edge collaborations.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:sivanarayanamadhala@gmail.com"
                className="flex items-center gap-4 p-4 glass-panel rounded-2xl border border-white/10 hover:border-primary-cyan/50 transition-all group hover:bg-white/5"
              >
                <div className="p-3 bg-surface rounded-xl group-hover:scale-110 text-primary-cyan transition-transform shadow-inner">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground/50 uppercase tracking-wider">Direct Email</h4>
                  <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary-cyan transition-colors">
                    sivanarayanamadhala@gmail.com
                  </p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/siva-narayana-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 glass-panel rounded-2xl border border-white/10 hover:border-primary-purple/50 transition-all group hover:bg-white/5"
              >
                <div className="p-3 bg-surface rounded-xl group-hover:scale-110 text-primary-purple transition-transform shadow-inner">
                  <GithubIcon size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground/50 uppercase tracking-wider">GitHub</h4>
                  <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary-purple transition-colors">
                    github.com/siva-narayana-1
                  </p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/siva-n-madhala"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 glass-panel rounded-2xl border border-white/10 hover:border-accent-blue/50 transition-all group hover:bg-white/5"
              >
                <div className="p-3 bg-surface rounded-xl group-hover:scale-110 text-accent-blue transition-transform shadow-inner">
                  <LinkedinIcon size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground/50 uppercase tracking-wider">LinkedIn</h4>
                  <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-accent-blue transition-colors">
                    linkedin.com/in/siva-n-madhala
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-7 glass-panel p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-purple/10 rounded-full blur-3xl pointer-events-none" />

            {/* Notification Status Banners */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-primary-cyan/15 border border-primary-cyan/50 text-foreground flex items-start gap-3 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                >
                  <CheckCircle2 className="text-primary-cyan shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-sm text-primary-cyan">Message Sent Successfully!</h5>
                    <p className="text-xs text-foreground/80 mt-0.5">
                      Thank you for reaching out. A confirmation has been logged and I will respond to your email shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/50 text-foreground flex items-start gap-3"
                >
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-sm text-red-400">Failed to Send</h5>
                    <p className="text-xs text-foreground/80 mt-0.5">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    Your Name <span className="text-primary-cyan">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                    placeholder="Siva Narayana"
                    className="w-full bg-surface/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-cyan transition-colors text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    Your Email <span className="text-primary-cyan">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                    placeholder="example@gmail.com"
                    className="w-full bg-surface/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-purple transition-colors text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  placeholder="AI Project Collaboration / Role Opportunity"
                  className="w-full bg-surface/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-cyan transition-colors text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                  Message <span className="text-primary-cyan">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status === "loading"}
                  rows={4}
                  placeholder="Describe your project, opportunity, or inquiry..."
                  className="w-full bg-surface/70 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-foreground/30 resize-none disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-gradient-to-r from-primary-cyan to-accent-blue text-slate-950 font-bold rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group shadow-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Dispatching Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
