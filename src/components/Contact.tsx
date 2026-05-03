"use client";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export default function Contact() {
  const { profile } = useProfile();
  
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6 z-10">
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
          <div className="w-24 h-1 bg-primary-purple md:mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <p className="text-xl text-foreground/80 leading-relaxed">
              Open for opportunities, collaboration, and building intelligent systems that solve real problems.
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-4 p-4 glass-panel rounded-xl hover:border-primary-cyan/50 transition-colors group">
                <div className="p-3 bg-surface rounded-lg group-hover:scale-110 transition-transform">
                  <Mail className="text-primary-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground/60">Email</h4>
                  <p className="text-lg">{profile.contact.email}</p>
                </div>
              </a>
              
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 glass-panel rounded-xl hover:border-primary-purple/50 transition-colors group">
                <div className="p-3 bg-surface rounded-lg group-hover:scale-110 transition-transform">
                  <GithubIcon className="text-primary-purple" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground/60">GitHub</h4>
                  <p className="text-lg">View my repositories</p>
                </div>
              </a>

              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 glass-panel rounded-xl hover:border-accent-blue/50 transition-colors group">
                <div className="p-3 bg-surface rounded-lg group-hover:scale-110 transition-transform">
                  <LinkedinIcon className="text-accent-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground/60">LinkedIn</h4>
                  <p className="text-lg">Connect professionally</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form mock */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-purple/10 rounded-full blur-3xl pointer-events-none" />
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-foreground/60 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-cyan transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/60 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/60 mb-2">Message</label>
                <textarea 
                  className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors h-32 resize-none"
                  placeholder="How can we work together?"
                />
              </div>
              <button className="w-full py-4 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 group">
                <span>Send Message</span>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
