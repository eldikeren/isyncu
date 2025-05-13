import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Venue, ScheduleSuggestion } from '@/types';

interface ScheduleRehearsalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: ScheduleSuggestion;
  bandId: string;
}

const ScheduleRehearsalDialog: React.FC<ScheduleRehearsalDialogProps> = ({ 
  open, 
  onOpenChange,
  suggestion,
  bandId
}) => {
  const { scheduleRehearsal } = useAppContext();
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      await scheduleRehearsal(bandId, suggestion);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to schedule rehearsal:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  if (!suggestion || !suggestion.venue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Rehearsal Booking</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Venue</Label>
            <p className="font-medium">{suggestion.venue.name}</p>
            <p className="text-sm text-gray-500">{suggestion.venue.location}</p>
          </div>
          
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <p className="font-medium">{format(suggestion.start, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-sm text-gray-500">
              {format(suggestion.start, 'h:mm a')} - {format(suggestion.end, 'h:mm a')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Details</Label>
            <p className="text-sm">
              This will send a calendar invitation to all band members and reserve the venue.
              Members will receive a link to confirm their attendance.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={isScheduling}>
            {isScheduling ? 'Scheduling...' : 'Schedule Rehearsal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleRehearsalDialog;
