import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { CalendarProvider } from '@/types/calendar';
import { CalendarProviderCard } from './CalendarProviderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const mockCalendarProviders: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    connected: false,
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
    connected: false,
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/ICal_Icon.png',
    connected: false,
  },
];

const CalendarIntegration: React.FC = () => {
  const { currentUser } = useAppContext();
  const [providers, setProviders] = useState<CalendarProvider[]>(mockCalendarProviders);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const handleConnect = async (providerId: string) => {
    // Simulate OAuth flow
    setSyncing(true);
    toast({
      title: 'Connecting to calendar',
      description: 'Authorizing with provider...',
    });
    
    try {
      // In a real app, this would redirect to OAuth
      // For demo, we'll simulate the OAuth flow with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update provider state
      setProviders(providers.map(p => 
        p.id === providerId ? { ...p, connected: true } : p
      ));
      
      // Simulate fetching calendar events
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSynced(new Date());
      toast({
        title: 'Calendar connected',
        description: `Successfully connected to ${providerId} calendar`,
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Could not connect to calendar provider',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = (providerId: string) => {
    setProviders(providers.map(p => 
      p.id === providerId ? { ...p, connected: false } : p
    ));
    
    toast({
      title: 'Calendar disconnected',
      description: `Successfully disconnected from ${providerId} calendar`,
    });
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    
    toast({
      title: 'Syncing calendars',
      description: 'Fetching your latest calendar events...',
    });
    
    try {
      // Simulate API call to sync calendars
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSynced(new Date());
      
      toast({
        title: 'Sync complete',
        description: 'Your calendar events have been updated',
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Could not sync calendar events',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const connectedCount = providers.filter(p => p.connected).length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar Integration</h2>
        {connectedCount > 0 && (
          <Button 
            variant="outline" 
            onClick={handleSyncNow}
            disabled={syncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        )}
      </div>
      
      {lastSynced && (
        <p className="text-sm text-muted-foreground">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map(provider => (
          <CalendarProviderCard
            key={provider.id}
            provider={provider}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>
      
      {connectedCount === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No calendars connected</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Connect at least one calendar to enable scheduling features
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Calendar Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Sharing Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Your calendar is currently {currentUser?.isAvailabilityShared ? 'shared' : 'not shared'} with your band members.
                  They can see your availability but not the details of your events.
                </p>
              </div>
              <Button variant="outline">
                {currentUser?.isAvailabilityShared ? 'Stop Sharing' : 'Share Availability'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarIntegration;
