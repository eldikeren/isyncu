import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Venue } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfDay } from 'date-fns';

interface TimeSlotProps {
  time: string;
  isAvailable: boolean;
  onClick?: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, isAvailable, onClick }) => {
  return (
    <div 
      className={`
        p-2 text-center rounded-md text-sm cursor-pointer
        ${isAvailable 
          ? 'bg-green-50 text-green-700 hover:bg-green-100' 
          : 'bg-gray-100 text-gray-400 line-through'}
      `}
      onClick={onClick}
    >
      {time}
    </div>
  );
};

interface VenueDayScheduleProps {
  venue: Venue;
  date: Date;
}

const VenueDaySchedule: React.FC<VenueDayScheduleProps> = ({ venue, date }) => {
  // Generate time slots for the day
  const timeSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 22; // 10 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const time = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    
    // Check if the venue is available at this time
    const currentDate = new Date(date);
    currentDate.setHours(hour, 0, 0, 0);
    
    // Simple availability check - in a real app, this would be more sophisticated
    const isAvailable = venue.availability.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return currentDate >= slotStart && currentDate < slotEnd;
    });
    
    timeSlots.push(
      <TimeSlot 
        key={`${venue.id}-${date.toISOString()}-${hour}`}
        time={time} 
        isAvailable={isAvailable} 
        onClick={() => {
          if (isAvailable) {
            // Handle slot selection
            console.log(`Selected ${venue.name} at ${time} on ${format(date, 'MMM dd')}`);
          }
        }}
      />
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {timeSlots}
      </div>
    </div>
  );
};

const VenueAvailability: React.FC = () => {
  const { venues } = useAppContext();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(venues[0] || null);
  
  // Generate dates for the next 7 days
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Venue Availability</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {venues.map(venue => (
          <Card 
            key={venue.id} 
            className={`cursor-pointer transition-all ${selectedVenue?.id === venue.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedVenue(venue)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{venue.name}</CardTitle>
              <CardDescription>{venue.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  {venue.availability.length} available slots
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedVenue && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedVenue.name} Schedule</CardTitle>
            <CardDescription>
              Available time slots for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={dates[0].toISOString()}>
              <TabsList className="mb-4 w-full overflow-auto">
                {dates.map(date => (
                  <TabsTrigger key={date.toISOString()} value={date.toISOString()}>
                    <div className="text-center">
                      <div className="font-medium">{format(date, 'EEE')}</div>
                      <div className="text-sm">{format(date, 'MMM d')}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dates.map(date => (
                <TabsContent key={date.toISOString()} value={date.toISOString()}>
                  <VenueDaySchedule venue={selectedVenue} date={date} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VenueAvailability;
