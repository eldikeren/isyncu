import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { SchedulingRequest } from '@/types/calendar';
import { toast } from '@/components/ui/use-toast';

const SchedulingAssistant: React.FC = () => {
  const { bands, venues, generateScheduleSuggestions } = useAppContext();
  
  const [schedulingRequest, setSchedulingRequest] = useState<SchedulingRequest>({
    bandId: bands.length > 0 ? bands[0].id : '',
    duration: 120, // 2 hours in minutes
    startDate: new Date(),
    endDate: addDays(new Date(), 14), // Look 2 weeks ahead
    preferredVenueIds: [],
    preferredTimeRanges: [],
  });
  
  const handleDurationChange = (value: number[]) => {
    setSchedulingRequest({
      ...schedulingRequest,
      duration: value[0],
    });
  };
  
  const handleBandChange = (value: string) => {
    setSchedulingRequest({
      ...schedulingRequest,
      bandId: value,
    });
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setSchedulingRequest({
        ...schedulingRequest,
        startDate: date,
      });
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setSchedulingRequest({
        ...schedulingRequest,
        endDate: date,
      });
    }
  };
  
  const handleVenueChange = (value: string) => {
    const currentVenues = schedulingRequest.preferredVenueIds || [];
    
    // Toggle the venue selection
    const updatedVenues = currentVenues.includes(value)
      ? currentVenues.filter(id => id !== value)
      : [...currentVenues, value];
    
    setSchedulingRequest({
      ...schedulingRequest,
      preferredVenueIds: updatedVenues,
    });
  };
  
  const handleFindTimes = () => {
    // In a real app, this would call an API to find available times
    toast({
      title: 'Finding available times',
      description: 'Analyzing calendars and venue availability...',
    });
    
    // Simulate API call
    setTimeout(() => {
      generateScheduleSuggestions(schedulingRequest.bandId, schedulingRequest.duration);
    }, 1500);
  };
  
  const selectedBand = bands.find(b => b.id === schedulingRequest.bandId);
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Band Selection */}
            <div className="space-y-2">
              <Label htmlFor="band">Select Band</Label>
              <Select 
                value={schedulingRequest.bandId} 
                onValueChange={handleBandChange}
              >
                <SelectTrigger id="band">
                  <SelectValue placeholder="Select a band" />
                </SelectTrigger>
                <SelectContent>
                  {bands.map(band => (
                    <SelectItem key={band.id} value={band.id}>
                      {band.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Duration */}
            <div className="space-y-2">
              <Label>Rehearsal Duration: {schedulingRequest.duration} minutes</Label>
              <Slider
                min={30}
                max={240}
                step={15}
                value={[schedulingRequest.duration]}
                onValueChange={handleDurationChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30m</span>
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h</span>
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Looking From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {schedulingRequest.startDate ? (
                        format(schedulingRequest.startDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={schedulingRequest.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {schedulingRequest.endDate ? (
                        format(schedulingRequest.endDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={schedulingRequest.endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Preferred Venues */}
            <div className="space-y-2">
              <Label>Preferred Venues (Optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {venues.map(venue => {
                  const isSelected = schedulingRequest.preferredVenueIds?.includes(venue.id);
                  return (
                    <Button
                      key={venue.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => handleVenueChange(venue.id)}
                    >
                      {venue.name}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleFindTimes}
              disabled={!schedulingRequest.bandId}
            >
              <Clock className="mr-2 h-4 w-4" />
              Find Available Times
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {selectedBand && (
        <Card>
          <CardHeader>
            <CardTitle>Band Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The scheduling assistant will check availability for these {selectedBand.members.length} members:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {selectedBand.members.map(member => (
                <div 
                  key={member.id} 
                  className="p-2 border rounded-md flex items-center"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>{member.name}</span>
                  {!member.isAvailabilityShared && (
                    <span className="ml-auto text-xs text-yellow-600">
                      No calendar
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchedulingAssistant;
