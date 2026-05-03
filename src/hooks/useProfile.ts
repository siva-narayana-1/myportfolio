"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { portfolioData } from "@/lib/data";

export function useProfile() {
  const [profile, setProfile] = useState<any>(portfolioData.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();
        
      if (data && !error) {
        setProfile({
          name: data.name,
          role: data.role,
          tagline: data.tagline,
          summary: data.summary,
          contact: {
            email: data.email,
            github: data.github,
            linkedin: data.linkedin
          }
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return { profile, loading };
}
