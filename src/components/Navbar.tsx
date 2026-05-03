"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Resume", href: "/resume/siva_resume.pdf" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-white/10 py-4 shadow-2xl" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold gradient-text tracking-tighter cursor-pointer">
            My Portfolio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span
                className="text-sm font-medium text-foreground/80 hover:text-primary-cyan transition-colors cursor-pointer"
                {...(link.href.endsWith('.pdf') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.name}
              </span>
            </Link>
          ))}
          <Link href="/admin/login">
            <span className="px-4 py-2 text-sm font-medium border border-primary-cyan/50 rounded-full text-primary-cyan hover:bg-primary-cyan/10 transition-colors cursor-pointer">
              Admin
            </span>
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full glass-panel flex flex-col items-center py-6 space-y-6 md:hidden"
        >
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
              <span
                className="text-lg font-medium text-foreground/80 hover:text-primary-cyan transition-colors"
                {...(link.href.endsWith('.pdf') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.name}
              </span>
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setIsOpen(false)}>
            <span className="px-6 py-2 border border-primary-cyan rounded-full text-primary-cyan">
              Admin
            </span>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
