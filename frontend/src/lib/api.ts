import type { User, Opportunity, Application, Message, Pickup, Metrics, RecyclingCategory } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- AUTH ---
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateMyProfile(data: Partial<User>) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword(data: any) {
  const res = await fetch(`${API_URL}/users/change-password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to change password');
  return res.json();
}

// --- OPPORTUNITIES ---
export async function getOpportunities(): Promise<Opportunity[]> {
  const res = await fetch(`${API_URL}/opportunities`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch opportunities');
  const json = await res.json();
  return json.data || [];
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  const res = await fetch(`${API_URL}/opportunities/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch opportunity');
  const json = await res.json();
  return json.data;
}

export async function createOpportunity(data: Partial<Opportunity>) {
  const res = await fetch(`${API_URL}/opportunities`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create opportunity');
  return res.json();
}

export async function updateOpportunity(id: string, data: Partial<Opportunity>) {
  const res = await fetch(`${API_URL}/opportunities/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update opportunity');
  return res.json();
}

export async function deleteOpportunity(id: string) {
  const res = await fetch(`${API_URL}/opportunities/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete opportunity');
  return res.json();
}

// --- MOCKS (For unimplemented backend features) ---

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockApplications: Application[] = [];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Green Earth Foundation',
    senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GE',
    content: 'Thanks for your interest in volunteering! We have new opportunities available.',
    timestamp: '2024-12-05T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    senderId: '3',
    senderName: 'EcoWarriors',
    senderAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EW',
    content: 'Your application has been reviewed. Looking forward to working with you!',
    timestamp: '2024-12-04T15:45:00Z',
    read: true,
  },
];

const mockPickups: Pickup[] = [
  {
    id: '1',
    location: '123 Green Street, San Francisco',
    date: '2024-12-10',
    time: '09:00 AM',
    status: 'scheduled',
    itemsCount: 45,
    volunteerId: '1',
    volunteerName: 'Volunteer',
  },
  {
    id: '2',
    location: 'Mumbai Central Park',
    date: '2024-12-12',
    time: '02:00 PM',
    status: 'scheduled',
    itemsCount: 32,
  },
];

const mockMetrics: Metrics = {
  totalPickups: 127,
  pickupsTrend: 12,
  itemsRecycled: 3420,
  itemsTrend: 8,
  volunteerHours: 256,
  hoursTrend: -3,
  co2Saved: 1.8,
  co2Trend: 15,
};

const mockRecyclingBreakdown: RecyclingCategory[] = [
  { name: 'Plastics', count: 1250, percentage: 37, color: 'hsl(199 89% 48%)' },
  { name: 'Paper', count: 980, percentage: 29, color: 'hsl(38 92% 50%)' },
  { name: 'Glass', count: 650, percentage: 19, color: 'hsl(142 55% 42%)' },
  { name: 'Metals', count: 340, percentage: 10, color: 'hsl(280 65% 55%)' },
  { name: 'Electronics', count: 200, percentage: 5, color: 'hsl(0 72% 51%)' },
];

export async function getApplications(): Promise<Application[]> {
  await delay(900);
  return mockApplications;
}

export async function getMessages(): Promise<Message[]> {
  await delay(700);
  return mockMessages;
}

export async function getUpcomingPickups(): Promise<Pickup[]> {
  await delay(850);
  return mockPickups;
}

export async function getMetrics(): Promise<Metrics> {
  await delay(600);
  return mockMetrics;
}

export async function getRecyclingBreakdown(): Promise<RecyclingCategory[]> {
  await delay(750);
  return mockRecyclingBreakdown;
}

export async function refreshToken(): Promise<{ success: boolean }> {
  await delay(500);
  return { success: true };
}

