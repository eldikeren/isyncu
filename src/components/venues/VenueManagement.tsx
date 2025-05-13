import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import VenueCard from './VenueCard';
import CreateVenueDialog from './CreateVenueDialog';

const VenueManagement: React.FC = () => {
  const { venues, currentUser } = useAppContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rehearsal Venues</h1>
        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Venue
          </Button>
        )}
      </div>

      {venues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-gray-500">
              No venues have been added yet.
            </p>
            {isAdmin && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Venue
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      <CreateVenueDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default VenueManagement;
