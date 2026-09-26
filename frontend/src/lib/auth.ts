export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("auth_token") || "";
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken().length > 0;
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { success: false, error: "Invalid credentials" };
    }

    const { token } = await response.json();
    setAuthToken(token);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function logout() {
  removeAuthToken();
}
