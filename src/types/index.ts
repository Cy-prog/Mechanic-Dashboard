export type BookingStatus =
  | "PENDING"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BookingPriority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatarUrl?: string | null;
  vehicles?: Vehicle[];
  createdAt: string | Date;
  _count?: {
    bookings: number;
  };
  totalSpent?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  customerId: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  status: "AVAILABLE" | "BUSY" | "EN_ROUTE" | "OFFLINE";
  rating: number;
  specialization: string;
  jobsCompleted: number;
  latitude: number;
  longitude: number;
  currentBookingId?: string | null;
  activeBooking?: Booking | null;
  createdAt: string | Date;
}

export interface StatusHistoryItem {
  id: string;
  bookingId: string;
  status: BookingStatus;
  timestamp: string | Date;
  note?: string | null;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  vehicleId?: string | null;
  vehicle?: Vehicle | null;
  mechanicId?: string | null;
  mechanic?: Mechanic | null;
  serviceCategory: string;
  serviceName: string;
  status: BookingStatus;
  priority: BookingPriority;
  amount: number;
  estimatedDuration: number;
  notes?: string | null;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  scheduledAt: string | Date;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  statusTimeline?: StatusHistoryItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DashboardMetrics {
  totalBookings: number;
  todaysBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  inProgressBookings: number;
  enRouteBookings: number;
  assignedBookings: number;
  totalRevenue: number;
  todaysRevenue: number;
  activeMechanics: number;
  totalMechanics: number;
  newCustomers: number;
  conversionRate: number;
  averageBookingValue: number;
  satisfactionScore: number;
}

export interface ChartDataPoint {
  date: string;
  bookings: number;
  revenue: number;
  completed: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface StatusCount {
  status: BookingStatus;
  count: number;
  percentage: number;
}
