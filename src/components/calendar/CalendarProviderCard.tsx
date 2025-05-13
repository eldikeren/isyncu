import React from 'react';
import { CalendarProvider } from '@/types/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarProviderCardProps {
  provider: CalendarProvider;
  onConnect: (providerId: string) => void;
  onDisconnect: (providerId: string) => void;
}

export const CalendarProviderCard: React.FC<CalendarProviderCardProps> = ({
  provider,
  onConnect,
  onDisconnect,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{provider.name}</CardTitle>
          {provider.connected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
              Not Connected
            </Badge>
          )}
        </div>
        <CardDescription>
          {provider.connected
            ? `Your ${provider.name} calendar is synced`
            : `Connect your ${provider.name} calendar to sync events`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center">
          <img 
            src={provider.icon} 
            alt={`${provider.name} logo`} 
            className="w-8 h-8 mr-2" 
          />
          <span className="text-sm text-gray-500">
            {provider.connected
              ? 'Calendar events are being synced automatically'
              : 'Connect to import your calendar events'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {provider.connected ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onDisconnect(provider.id)}
          >
            Disconnect
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => onConnect(provider.id)}
          >
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
