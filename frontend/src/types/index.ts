export type UserRole = 'volunteer' | 'ngo';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  location?: string;
  skills?: string[];
  bio?: string;
  organizationName?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'open' | 'closed' | 'in-progress';
  ngoId: string;
  ngoName: string;
  requiredSkills: string[];
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  volunteerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  ngoName: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Pickup {
  id: string;
  location: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  itemsCount: number;
  volunteerId?: string;
  volunteerName?: string;
}

export interface Metrics {
  totalPickups: number;
  pickupsTrend: number;
  itemsRecycled: number;
  itemsTrend: number;
  volunteerHours: number;
  hoursTrend: number;
  co2Saved: number;
  co2Trend: number;
}

export interface RecyclingCategory {
  name: string;
  count: number;
  percentage: number;
  color: string;
}
