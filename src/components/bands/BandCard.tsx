import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Band } from '@/types';
import { Users, Calendar, Trash } from 'lucide-react';

interface BandCardProps {
  band: Band;
  onManage: (band: Band) => void;
  onSchedule: (band: Band) => void;
  onDelete?: (bandId: string) => void;
}

const BandCard: React.FC<BandCardProps> = ({ band, onManage, onSchedule, onDelete }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{band.name}</CardTitle>
        <CardDescription>
          <div className="flex items-center mt-1">
            <Users size={16} className="mr-1" />
            <span>{band.members.length} members</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p>Admin: {band.members.find(m => m.id === band.adminId)?.name || 'Unknown'}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onManage(band)}>
          <Users className="mr-2 h-4 w-4" /> Manage Members
        </Button>
        <div className="flex gap-2">
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(band.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" onClick={() => onSchedule(band)}>
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BandCard;