export interface CalendarProvider {
  id: string;
  name: 'Google' | 'Outlook' | 'Apple';
  icon: string;
  connected: boolean;
}

export interface CalendarAccount {
  id: string;
  userId: string;
  providerId: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isConnected: boolean;
}

export interface CalendarSyncStatus {
  userId: string;
  lastSynced: Date | null;
  status: 'synced' | 'syncing' | 'error' | 'not_connected';
  error?: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  start: Date;
  end: Date;
  recurring?: boolean;
  recurrenceRule?: string;
}

export interface SchedulingRequest {
  bandId: string;
  duration: number; // in minutes
  startDate?: Date;
  endDate?: Date;
  preferredVenueIds?: string[];
  preferredTimeRanges?: {
    dayOfWeek: number; // 0-6, 0 is Sunday
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  }[];
}
