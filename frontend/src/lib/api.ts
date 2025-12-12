import type { User, Opportunity, Application, Message, Pickup, Metrics, RecyclingCategory } from '@/types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockVolunteerUser: User = {
  id: '1',
  email: 'volunteer.green@email.com',
  name: 'Volunteer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'volunteer',
  location: 'Mumbai, India',
  skills: ['Sorting', 'Driving', 'Community Outreach'],
  bio: 'Passionate about reducing waste and building a sustainable future.',
  createdAt: '2024-01-15',
};

const mockNgoUser: User = {
  id: '2',
  email: 'contact@greenearth.org',
  name: 'NGO Green Earth',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  role: 'ngo',
  location: 'Bangalore, India',
  organizationName: 'Green Earth Foundation',
  bio: 'Leading environmental conservation efforts since 2015.',
  createdAt: '2023-06-20',
};

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Community Recycling Drive',
    description: 'Help sort and process recyclables at our monthly community drive.',
    location: 'Downtown Community Center',
    date: '2024-12-15',
    status: 'open',
    ngoId: '2',
    ngoName: 'Green Earth Foundation',
    requiredSkills: ['Sorting', 'Lifting'],
    applicationsCount: 12,
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    title: 'Beach Cleanup Initiative',
    description: 'Join us for a day of cleaning up our local beaches.',
    location: 'Ocean Beach',
    date: '2024-12-20',
    status: 'open',
    ngoId: '2',
    ngoName: 'Green Earth Foundation',
    requiredSkills: ['Outdoor Work', 'Team Player'],
    applicationsCount: 8,
    createdAt: '2024-11-05',
  },
];

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

// API functions with simulated delays
export async function getCurrentUser(role?: UserRole): Promise<User> {
  await delay(800);
  return role === 'ngo' ? mockNgoUser : mockVolunteerUser;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  await delay(1000);
  return mockOpportunities;
}

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

// Type export for role
type UserRole = 'volunteer' | 'ngo';
