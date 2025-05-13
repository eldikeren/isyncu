import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ScheduleSuggestion } from '@/types';
import ScheduleRehearsalDialog from './ScheduleRehearsalDialog';

interface SchedulingSuggestionProps {
  suggestion: ScheduleSuggestion;
  bandId: string;
}

const SchedulingSuggestion: React.FC<SchedulingSuggestionProps> = ({ suggestion, bandId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { start, end, venue, score } = suggestion;

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`mr-2 rounded-full p-1 ${getScoreColor(score)}`}>
                <span className="block h-8 w-8 rounded-full bg-white text-center font-bold leading-8">
                  {score}%
                </span>
              </div>
              <span className="font-semibold">Match Score</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="mr-3 h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{format(start, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="mr-3 h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                </p>
              </div>
            </div>

            {venue && (
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-gray-500">{venue.location}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-slate-50 p-3">
          <Button onClick={() => setIsDialogOpen(true)}>
            Schedule
          </Button>
        </CardFooter>
      </Card>

      <ScheduleRehearsalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        suggestion={suggestion}
        bandId={bandId}
      />
    </>
  );
};

// Helper function to get color based on score
const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-orange-100 text-orange-800';
};

export default SchedulingSuggestion;
