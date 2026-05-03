"use client";
import { useProfile } from "@/hooks/useProfile";

export default function Footer() {
  const { profile } = useProfile();

  return (
    <footer className="border-t border-white/10 py-12 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <span className="text-2xl font-bold gradient-text tracking-tighter">
            My Portfolio
          </span>
          <p className="text-foreground/50 text-sm mt-2">
            Building the next generation of intelligent systems.
          </p>
        </div>

        <div className="text-foreground/50 text-sm">
          &copy; {new Date().getFullYear()} {profile?.name || "Siva"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
