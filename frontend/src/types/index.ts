export type UserRole = "VOLUNTEER" | "NGO";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  skills?: string[];
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}





