import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Combined scheduling components in a single file due to space constraints

// Scheduling Form Component
export const SchedulingForm: React.FC = () => {
  const { generateScheduleSuggestions } = useAppContext();
  const [duration, setDuration] = useState(120); // 2 hours in minutes

  const handleGenerateSuggestions = () => {
    generateScheduleSuggestions('1', duration);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Schedule a Rehearsal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes): {duration}</Label>
            <Slider
              id="duration"
              min={30}
              max={240}
              step={15}
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
            />
          </div>
          <Button onClick={handleGenerateSuggestions}>
            <Calendar className="mr-2 h-4 w-4" />
            Find Available Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Suggestion Card Component
interface SuggestionCardProps {
  start: Date;
  end: Date;
  venue?: string;
  score: number;
  onSelect: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  start, 
  end, 
  venue, 
  score, 
  onSelect 
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-lg font-medium">
              {format(start, 'EEEE, MMMM d')}
            </div>
            <div>
              {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
            </div>
            {venue && <div className="text-sm text-muted-foreground">at {venue}</div>}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{score}%</div>
            <div className="text-sm text-muted-foreground">match</div>
          </div>
        </div>
        <Button className="w-full" onClick={onSelect}>Select This Time</Button>
      </CardContent>
    </Card>
  );
};

// Suggestions List Component
export const SuggestionsList: React.FC = () => {
  const { suggestions } = useAppContext();

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No suggestions available. Use the form above to generate suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Suggested Times</h3>
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          start={suggestion.start}
          end={suggestion.end}
          venue={suggestion.venue?.name}
          score={suggestion.score}
          onSelect={() => alert(`Selected time: ${format(suggestion.start, 'PPpp')}`)} 
        />
      ))}
    </div>
  );
};

// Main Scheduling Component
const Scheduling: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Scheduling</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SchedulingForm />
        </div>
        <div className="lg:col-span-2">
          <SuggestionsList />
        </div>
      </div>
    </div>
  );
};

export default Scheduling;