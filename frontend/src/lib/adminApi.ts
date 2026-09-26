const API_URL = "http://localhost:5000";

function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

function getHeaders(token: string = getAuthToken()) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const adminApi = {
  async getExperience() {
    const res = await fetch(`${API_URL}/api/admin/experience`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch experience");
    return res.json();
  },

  async createExperience(data: any) {
    const res = await fetch(`${API_URL}/api/admin/experience`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create experience");
    return res.json();
  },

  async updateExperience(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/admin/experience/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update experience");
    return res.json();
  },

  async deleteExperience(id: string) {
    const res = await fetch(`${API_URL}/api/admin/experience/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete experience");
    return res.json();
  },

  async getSkills() {
    const res = await fetch(`${API_URL}/api/admin/skills`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch skills");
    return res.json();
  },

  async createSkill(data: any) {
    const res = await fetch(`${API_URL}/api/admin/skills`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create skill");
    return res.json();
  },

  async updateSkill(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/admin/skills/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update skill");
    return res.json();
  },

  async deleteSkill(id: string) {
    const res = await fetch(`${API_URL}/api/admin/skills/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete skill");
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_URL}/api/admin/profile`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  async updateProfile(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/admin/profile/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
};
