import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfDay, addHours } from 'date-fns';
import { Band, User } from '@/types';

interface AvailabilitySlot {
  hour: number;
  available: boolean;
}

interface MemberRowProps {
  user: User;
  slots: AvailabilitySlot[];
}

const MemberRow: React.FC<MemberRowProps> = ({ user, slots }) => {
  return (
    <div className="flex items-center py-2 border-b border-gray-100">
      <div className="w-32 font-medium truncate pr-2">{user.name}</div>
      <div className="flex-1 grid grid-cols-13 gap-1">
        {slots.map((slot, index) => (
          <div 
            key={index}
            className={`h-6 rounded-sm ${slot.available ? 'bg-green-100' : 'bg-red-100'}`}
            title={`${user.name} is ${slot.available ? 'available' : 'unavailable'} at ${slot.hour % 12 || 12}${slot.hour < 12 ? 'AM' : 'PM'}`}
          />
        ))}
      </div>
    </div>
  );
};

interface AvailabilityMatrixProps {
  bandId?: string;
}

const AvailabilityMatrix: React.FC<AvailabilityMatrixProps> = ({ bandId }) => {
  const { bands, events } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  
  // Get the selected band or the first band
  const selectedBand = bandId 
    ? bands.find(b => b.id === bandId) 
    : bands.length > 0 ? bands[0] : null;
  
  if (!selectedBand) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>No band selected or available.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Generate dates for the next 7 days
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  // Generate hours for the day (9 AM to 10 PM)
  const hours = Array.from({ length: 14 }, (_, i) => i + 9);
  
  // Generate availability data for each member
  const memberAvailability = selectedBand.members.map(member => {
    // In a real app, this would use actual calendar data
    // For demo, we'll generate random availability
    const memberEvents = events.filter(event => event.userId === member.id);
    
    const slots = hours.map(hour => {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, 0, 0, 0);
      const slotEndTime = addHours(slotTime, 1);
      
      // Check if member has an event during this slot
      const hasEvent = memberEvents.some(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          (slotTime >= eventStart && slotTime < eventEnd) ||
          (slotEndTime > eventStart && slotEndTime <= eventEnd) ||
          (slotTime <= eventStart && slotEndTime >= eventEnd)
        );
      });
      
      return {
        hour,
        available: !hasEvent,
      };
    });
    
    return {
      user: member,
      slots,
    };
  });
  
  // Calculate group availability (when everyone is available)
  const groupAvailability = hours.map(hour => {
    const allAvailable = memberAvailability.every(ma => 
      ma.slots.find(s => s.hour === hour)?.available
    );
    
    return {
      hour,
      available: allAvailable,
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Band Availability</CardTitle>
        <CardDescription>
          View when all members of {selectedBand.name} are available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={dates[0].toISOString()} 
          onValueChange={(value) => setSelectedDate(new Date(value))}
        >
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
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-32"></div>
                  <div className="flex-1 grid grid-cols-13 gap-1">
                    {hours.map(hour => (
                      <div key={hour} className="text-xs text-center">
                        {hour % 12 || 12}{hour < 12 ? 'a' : 'p'}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Group availability row */}
                <div className="flex items-center py-2 border-b-2 border-gray-200 mb-2">
                  <div className="w-32 font-bold">Everyone</div>
                  <div className="flex-1 grid grid-cols-13 gap-1">
                    {groupAvailability.map((slot, index) => (
                      <div 
                        key={index}
                        className={`h-6 rounded-sm ${slot.available ? 'bg-green-500' : 'bg-gray-200'}`}
                        title={`Everyone is ${slot.available ? 'available' : 'not available'} at ${slot.hour % 12 || 12}${slot.hour < 12 ? 'AM' : 'PM'}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Individual member rows */}
                {memberAvailability.map(ma => (
                  <MemberRow 
                    key={ma.user.id} 
                    user={ma.user} 
                    slots={ma.slots} 
                  />
                ))}
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                  <span className="text-sm">Everyone Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded-sm mr-2"></div>
                  <span className="text-sm">Member Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 rounded-sm mr-2"></div>
                  <span className="text-sm">Member Busy</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AvailabilityMatrix;
