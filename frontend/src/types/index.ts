export type UserRole = 'VOLUNTEER' | 'NGO';

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
  // Backend fields (Primary)
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  duration?: string;
  location: string;
  status: 'Open' | 'Closed' | 'In-progress' | 'open' | 'closed' | 'in-progress';
  NGOID?: {
      _id: string;
      name: string;
      email: string;
  } | string;
  
  // Frontend/Mock compatibility fields (Optional)
  id?: string; 
  date?: string;
  ngoId?: string;
  ngoName?: string;
  applicationsCount?: number;
  
  createdAt?: string;
  updatedAt?: string;
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
  count: number// filepath: /Users/melbinroy/Documents/waste-zero-nov-team03/frontend/src/types/index.ts
export type UserRole = 'VOLUNTEER' | 'NGO';

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
  // Backend fields (Primary)
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  duration?: string;
  location: string;
  status: 'Open' | 'Closed' | 'In-progress' | 'open' | 'closed' | 'in-progress';
  NGOID?: {
      _id: string;
      name: string;
      email: string;
  } | string;
  
  // Frontend/Mock compatibility fields (Optional)
  id?: string; 
  date?: string;
  ngoId?: string;
  ngoName?: string;
  applicationsCount?: number;
  
  createdAt?: string;
  updatedAt?: string;
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
