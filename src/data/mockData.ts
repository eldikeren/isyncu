import { Band, User, CalendarEvent, Venue, ScheduleSuggestion } from '@/types';
import { addDays, addHours, setHours } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    isAvailabilityShared: true,
    isLocationShared: false,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    isAvailabilityShared: true,
    isLocationShared: true,
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    isAvailabilityShared: true,
    isLocationShared: false,
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'member',
    isAvailabilityShared: false,
    isLocationShared: false,
  },
];

// Mock Bands
export const mockBands: Band[] = [
  {
    id: 'band-1',
    name: 'The Rockers',
    adminId: 'user-1',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: 'band-2',
    name: 'Jazz Ensemble',
    adminId: 'user-1',
    members: [mockUsers[0], mockUsers[3]],
  },
];

// Helper to generate random events
const generateEvents = () => {
  const events: CalendarEvent[] = [];
  const now = new Date();
  
  // Generate some events for each user
  mockUsers.forEach(user => {
    // Generate 5 random events per user
    for (let i = 0; i < 5; i++) {
      const dayOffset = Math.floor(Math.random() * 14); // Random day in next 2 weeks
      const hourOffset = Math.floor(Math.random() * 8) + 9; // Random hour between 9 AM and 5 PM
      const duration = Math.floor(Math.random() * 3) + 1; // 1-3 hours
      
      const start = setHours(addDays(now, dayOffset), hourOffset);
      const end = addHours(start, duration);
      
      events.push({
        id: `event-${user.id}-${i}`,
        userId: user.id,
        title: `Event ${i + 1}`,
        start,
        end,
      });
    }
  });
  
  return events;
};

// Mock Calendar Events
export const mockEvents: CalendarEvent[] = generateEvents();

// Mock Venues
export const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    name: 'Downtown Studio',
    location: '123 Main St',
    availability: [
      {
        id: 'avail-1',
        venueId: 'venue-1',
        start: setHours(addDays(new Date(), 1), 10),
        end: setHours(addDays(new Date(), 1), 22),
      },
      {
        id: 'avail-2',
        venueId: 'venue-1',
        start: setHours(addDays(new Date(), 2), 10),
        end: setHours(addDays(new Date(), 2), 22),
      },
    ],
  },
  {
    id: 'venue-2',
    name: 'Music Center',
    location: '456 Broadway',
    availability: [
      {
        id: 'avail-3',
        venueId: 'venue-2',
        start: setHours(addDays(new Date(), 1), 9),
        end: setHours(addDays(new Date(), 1), 18),
      },
      {
        id: 'avail-4',
        venueId: 'venue-2',
        start: setHours(addDays(new Date(), 3), 9),
        end: setHours(addDays(new Date(), 3), 18),
      },
    ],
  },
  {
    id: 'venue-3',
    name: 'The Garage',
    location: '789 Rock Ave',
    availability: [
      {
        id: 'avail-5',
        venueId: 'venue-3',
        start: setHours(addDays(new Date(), 2), 12),
        end: setHours(addDays(new Date(), 2), 23),
      },
      {
        id: 'avail-6',
        venueId: 'venue-3',
        start: setHours(addDays(new Date(), 4), 12),
        end: setHours(addDays(new Date(), 4), 23),
      },
    ],
  },
];

// Mock Schedule Suggestions
export const mockSuggestions: ScheduleSuggestion[] = [
  {
    id: 'suggestion-1',
    start: setHours(addDays(new Date(), 2), 18),
    end: setHours(addDays(new Date(), 2), 20),
    venue: mockVenues[0],
    score: 95,
  },
  {
    id: 'suggestion-2',
    start: setHours(addDays(new Date(), 3), 14),
    end: setHours(addDays(new Date(), 3), 16),
    venue: mockVenues[1],
    score: 85,
  },
  {
    id: 'suggestion-3',
    start: setHours(addDays(new Date(), 5), 19),
    end: setHours(addDays(new Date(), 5), 21),
    venue: mockVenues[2],
    score: 75,
  },
];
