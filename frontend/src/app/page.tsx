import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profileRes = await fetch("http://localhost:3000/api/portfolio/profile", {
      next: { revalidate: 60 },
    });
    const profile = await profileRes.json();

    return {
      title: profile.name,
      description: profile.bio,
      openGraph: {
        title: profile.name,
        description: profile.bio,
        images: profile.profileImage
          ? [
              {
                url: profile.profileImage,
                width: 400,
                height: 400,
                alt: profile.name,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Portfolio",
      description: "My portfolio",
    };
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}
