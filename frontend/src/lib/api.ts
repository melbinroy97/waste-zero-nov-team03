import type { User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000/api";

// Helper to get JWT token
function getToken() {
  return localStorage.getItem("token");
}



function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// LOGIN USER
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token, user }
}

// REGISTER USER
export async function registerUser(data: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// FETCH CURRENT USER
export async function getCurrentUser(): Promise<User> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return (await res.json()).user;
}

export async function refreshToken() {
  return { success: true }; // Optional
}




// =======================================
// TEMP DASHBOARD API STUBS (Milestone 1)
// Prevents runtime crashes
// Replace with real APIs in Milestone 2
// =======================================

// VOLUNTEER DASHBOARD
export async function getApplications() {
  return [];
}

export async function getMessages() {
  return [];
}

export async function getUpcomingPickups() {
  return [];
}

// NGO + VOLUNTEER DASHBOARD
export async function getOpportunities() {
  return [];
}

export async function getMetrics() {
  return {
    totalPickups: 0,
    pickupsTrend: 0,
    itemsRecycled: 0,
    itemsTrend: 0,
    volunteerHours: 0,
    hoursTrend: 0,
    co2Saved: 0,
    co2Trend: 0,
  };
}

export async function getRecyclingBreakdown() {
  return [];
}



//EDIT USER PROFILE

export const getMyProfile = async () => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const updateMyProfile = async (data: any) => {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const changePassword = async (data: any) => {
  const res = await fetch(`${API_URL}/users/change-password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};
