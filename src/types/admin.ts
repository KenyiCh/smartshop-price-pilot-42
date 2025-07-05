
export interface UpdateConfig {
  frequency: string;
  startDate: string;
  endDate: string;
  selectedStores: number[];
  selectedCategories: string[];
  isSpecialEvent: boolean;
  eventName: string;
}

export interface UserReport {
  id: number;
  reportedBy: string;
  reason: string;
  date: string;
  description: string;
  status: "pending" | "reviewed" | "resolved";
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "reported" | "banned";
  reportCount: number;
  registrationDate: string;
  lastActivity: string;
  reviewsCount: number;
  reports: UserReport[];
  aiDetections: string[];
}

export interface ReviewReport {
  id: number;
  reportedBy: string;
  reason: string;
  date: string;
  description: string;
}

export interface Review {
  id: number;
  user: string;
  userId: number;
  product: string;
  productId: number;
  comment: string;
  status: "pending" | "approved" | "reported" | "rejected";
  date: string;
  reportReasons?: string[];
  rating: number;
  reports: ReviewReport[];
  aiDetection?: string;
}

export interface Store {
  id: number;
  name: string;
  url: string;
  status: "active" | "inactive";
  lastUpdate: string;
  apiKey: string;
  integrationType: string;
  categories: string[];
}
