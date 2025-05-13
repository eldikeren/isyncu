import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAppContext } from '@/contexts/AppContext';
import VenueManagement from './venues/VenueManagement';
import { Toaster } from '@/components/ui/toaster';
import BandManagement from './bands/BandManagement';
import SchedulingAssistant from './scheduling/SchedulingAssistant';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import InviteMemberDialog from './members/InviteMemberDialog';
import SchedulingSuggestion from './scheduling/SchedulingSuggestion';

const AppLayout: React.FC = () => {
  const { sidebarOpen, activePage, bands, suggestions, currentUser } = useAppContext();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedBandId, setSelectedBandId] = useState(bands[0]?.id || '');
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  
  const isAdmin = currentUser?.role === 'admin';

  // Filter suggestions based on admin override
  const filteredSuggestions = showAllSuggestions 
    ? suggestions 
    : suggestions.filter(s => s.score >= 90);

  // Render the active page based on sidebar selection
  const renderActivePage = () => {
    switch (activePage) {
      case 'venues':
        return <VenueManagement />;
      case 'scheduling':
        return (
          <div className="container mx-auto p-4">
            <Tabs defaultValue="assistant">
              <TabsList className="mb-4">
                <TabsTrigger value="assistant">Scheduling Assistant</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assistant">
                <SchedulingAssistant />
              </TabsContent>
              
              <TabsContent value="suggestions">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Scheduling Suggestions</h1>
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                      >
                        {showAllSuggestions ? "Show Perfect Matches Only" : "Show All Suggestions"}
                      </Button>
                    )}
                  </div>
                  
                  {filteredSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredSuggestions.map((suggestion) => (
                        <SchedulingSuggestion 
                          key={suggestion.id} 
                          suggestion={suggestion} 
                          bandId={bands[0]?.id || ''}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p>No scheduling suggestions available. Use the Scheduling Assistant to generate some!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'calendar':
        return (
          <div className="container mx-auto p-4">
            <h1 className="mb-6 text-2xl font-bold">Calendar Integration</h1>
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Connect your calendar to sync availability with your band members.</p>
                <div className="flex flex-wrap gap-2">
                  <Button>Connect Google Calendar</Button>
                  <Button variant="outline">Connect Outlook</Button>
                  <Button variant="outline">Connect Apple Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'bands':
      default:
        return (
          <div>
            <BandManagement />
            {bands.length > 0 && (
              <div className="container mx-auto p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Invite Band Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Invite new members to join your band via SMS or WhatsApp.</p>
                    <Button 
                      onClick={() => {
                        setSelectedBandId(bands[0].id);
                        setInviteDialogOpen(true);
                      }}
                    >
                      Invite New Member
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            <InviteMemberDialog 
              open={inviteDialogOpen} 
              onOpenChange={setInviteDialogOpen} 
              bandId={selectedBandId}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-100 bg-[url('/grunge-texture.jpg')] bg-cover bg-blend-overlay">
      <Sidebar />
      <main
        className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        <div className="container py-6">
          {renderActivePage()}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
