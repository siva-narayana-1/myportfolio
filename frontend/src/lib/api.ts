// Get API base URL from environment variable
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// API Functions with CORS support
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API error");
  }

  return response.json();
}

// Authenticated API call
export async function apiCallAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;

  return apiCall(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Portfolio API Calls
export const portfolioAPI = {
  getProfile: () => apiCall("/api/portfolio/profile"),
  getProjects: () => apiCall("/api/portfolio/projects"),
  getSkills: () => apiCall("/api/portfolio/skills"),
  getExperience: () => apiCall("/api/portfolio/experience"),
  getEducation: () => apiCall("/api/portfolio/education"),
  submitContact: (data: any) =>
    apiCall("/api/portfolio/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Admin API Calls
export const adminAPI = {
  login: (email: string, password: string) =>
    apiCall("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Projects
  getProjects: () => apiCallAuth("/api/admin/projects"),
  createProject: (data: any) =>
    apiCallAuth("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: any) =>
    apiCallAuth(`/api/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    apiCallAuth(`/api/admin/projects/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () => apiCallAuth("/api/admin/skills"),
  createSkill: (data: any) =>
    apiCallAuth("/api/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSkill: (id: string, data: any) =>
    apiCallAuth(`/api/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSkill: (id: string) =>
    apiCallAuth(`/api/admin/skills/${id}`, { method: "DELETE" }),

  // Experience
  getExperience: () => apiCallAuth("/api/admin/experience"),
  createExperience: (data: any) =>
    apiCallAuth("/api/admin/experience", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateExperience: (id: string, data: any) =>
    apiCallAuth(`/api/admin/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteExperience: (id: string) =>
    apiCallAuth(`/api/admin/experience/${id}`, { method: "DELETE" }),

  // Education
  getEducation: () => apiCallAuth("/api/admin/education"),
  createEducation: (data: any) =>
    apiCallAuth("/api/admin/education", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEducation: (id: string, data: any) =>
    apiCallAuth(`/api/admin/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEducation: (id: string) =>
    apiCallAuth(`/api/admin/education/${id}`, { method: "DELETE" }),

  // Profile
  getProfile: () => apiCallAuth("/api/admin/profile"),
  createProfile: (data: any) =>
    apiCallAuth("/api/admin/profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (id: string, data: any) =>
    apiCallAuth(`/api/admin/profile/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Messages
  getMessages: () => apiCallAuth("/api/admin/messages"),
  deleteMessage: (id: string) =>
    apiCallAuth(`/api/admin/messages/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => apiCallAuth("/api/admin/settings"),
  createSettings: (data: any) =>
    apiCallAuth("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSettings: (id: string, data: any) =>
    apiCallAuth(`/api/admin/settings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
