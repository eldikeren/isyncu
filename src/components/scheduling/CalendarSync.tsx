import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalendarIntegration from '../calendar/CalendarIntegration';
import VenueAvailability from './VenueAvailability';
import AvailabilityMatrix from './AvailabilityMatrix';

const CalendarSync: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connect');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calendar Synchronization</h1>
      
      <Tabs defaultValue="connect" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="connect">Connect Calendars</TabsTrigger>
          <TabsTrigger value="availability">Band Availability</TabsTrigger>
          <TabsTrigger value="venues">Venue Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect">
          <CalendarIntegration />
        </TabsContent>
        
        <TabsContent value="availability">
          <AvailabilityMatrix />
        </TabsContent>
        
        <TabsContent value="venues">
          <VenueAvailability />
        </TabsContent>
      </Tabs>
      
      {activeTab !== 'connect' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Schedule a Rehearsal</CardTitle>
            <CardDescription>
              Use the availability information to find the perfect time for your band
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full sm:w-auto">
              Open Scheduling Assistant
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarSync;
