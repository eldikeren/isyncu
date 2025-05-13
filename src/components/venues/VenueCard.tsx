import React from 'react';
import { Venue } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const { name, location, availability } = venue;

  // Get the next available time slot
  const nextAvailable = availability.length > 0 
    ? availability.sort((a, b) => a.start.getTime() - b.start.getTime())[0]
    : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="mb-2 font-medium">Next Available:</h3>
        {nextAvailable ? (
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span>{format(nextAvailable.start, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span>
                {format(nextAvailable.start, 'h:mm a')} - {format(nextAvailable.end, 'h:mm a')}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No availability listed</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-slate-50 px-6 py-3">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button size="sm">
          Book Venue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VenueCard;
