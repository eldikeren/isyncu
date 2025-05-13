import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BandCard from './BandCard';
import CreateBandDialog from './CreateBandDialog';
import { Band } from '@/types';
import InviteMemberDialog from '../members/InviteMemberDialog';

const BandManagement: React.FC = () => {
  const { bands, currentUser, deleteBand, setActivePage } = useAppContext();
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleManageBand = (band: Band) => {
    setSelectedBand(band);
    setInviteDialogOpen(true);
  };

  const handleScheduleBand = (band: Band) => {
    setSelectedBand(band);
    setActivePage('scheduling');
  };

  const handleDeleteBand = (bandId: string) => {
    deleteBand(bandId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-display">Band Management</h1>
        <CreateBandDialog />
      </div>

      <Tabs defaultValue="mybands" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="mybands">My Bands</TabsTrigger>
          <TabsTrigger value="joined">Joined Bands</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mybands">
          {bands.filter(band => band.adminId === currentUser?.id).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bands
                .filter(band => band.adminId === currentUser?.id)
                .map(band => (
                  <BandCard
                    key={band.id}
                    band={band}
                    onManage={handleManageBand}
                    onSchedule={handleScheduleBand}
                    onDelete={handleDeleteBand}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No bands created yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You haven't created any bands yet. Create your first band to get started!</p>
                <CreateBandDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="joined">
          {bands.filter(band => 
            band.adminId !== currentUser?.id && 
            band.members.some(member => member.id === currentUser?.id)
          ).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bands
                .filter(band => 
                  band.adminId !== currentUser?.id && 
                  band.members.some(member => member.id === currentUser?.id)
                )
                .map(band => (
                  <BandCard
                    key={band.id}
                    band={band}
                    onManage={handleManageBand}
                    onSchedule={handleScheduleBand}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No joined bands</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You haven't been added to any bands yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedBand && (
        <InviteMemberDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          bandId={selectedBand.id}
        />
      )}
    </div>
  );
};

export default BandManagement;