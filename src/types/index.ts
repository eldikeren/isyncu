export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'venue';
  isAvailabilityShared: boolean;
  isLocationShared: boolean;
}

export interface Band {
  id: string;
  name: string;
  adminId: string;
  members: User[];
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  start: Date;
  end: Date;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  availability: VenueAvailability[];
}

export interface VenueAvailability {
  id: string;
  venueId: string;
  start: Date;
  end: Date;
}

export interface ScheduleConstraint {
  userId: string;
  noLateNight: boolean;
  preferredDays: string[];
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
}

export interface ScheduleSuggestion {
  id: string;
  start: Date;
  end: Date;
  venue?: Venue;
  score: number;
}