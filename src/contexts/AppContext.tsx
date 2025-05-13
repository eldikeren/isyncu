import React, { createContext, useContext, useState } from 'react';
import { Band, User, CalendarEvent, Venue, ScheduleSuggestion } from '@/types';
import { mockBands, mockUsers, mockEvents, mockVenues, mockSuggestions } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  
  // Data State
  currentUser: User | null;
  bands: Band[];
  events: CalendarEvent[];
  venues: Venue[];
  suggestions: ScheduleSuggestion[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  createBand: (name: string) => void;
  deleteBand: (bandId: string) => void;
  addMemberToBand: (bandId: string, user: User) => void;
  generateScheduleSuggestions: (bandId: string, duration: number) => void;
  addVenue: (name: string, location: string, contactPhone?: string) => void;
  sendInvitation: (bandId: string, name: string, contactInfo: string, method: string) => void;
  scheduleRehearsal: (bandId: string, suggestion: ScheduleSuggestion) => Promise<void>;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  activePage: 'bands',
  setActivePage: () => {},
  
  currentUser: null,
  bands: [],
  events: [],
  venues: [],
  suggestions: [],
  
  setCurrentUser: () => {},
  createBand: () => {},
  deleteBand: () => {},
  addMemberToBand: () => {},
  generateScheduleSuggestions: () => {},
  addVenue: () => {},
  sendInvitation: () => {},
  scheduleRehearsal: async () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('bands');
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [bands, setBands] = useState<Band[]>(mockBands);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>(mockSuggestions);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const createBand = (name: string) => {
    if (!currentUser) return;
    
    const newBand: Band = {
      id: `band-${Date.now()}`,
      name,
      adminId: currentUser.id,
      members: [currentUser],
    };
    
    setBands([...bands, newBand]);
    toast({
      title: 'Band Created',
      description: `${name} has been created successfully`,
    });
  };

  const deleteBand = (bandId: string) => {
    setBands(bands.filter(band => band.id !== bandId));
    toast({
      title: 'Band Deleted',
      description: 'The band has been deleted successfully',
    });
  };

  const addMemberToBand = (bandId: string, user: User) => {
    setBands(bands.map(band => {
      if (band.id === bandId) {
        return {
          ...band,
          members: [...band.members, user]
        };
      }
      return band;
    }));
    
    toast({
      title: 'Member Added',
      description: `${user.name} has been added to the band`,
    });
  };

  const generateScheduleSuggestions = (bandId: string, duration: number) => {
    // In a real app, this would call an AI service to generate suggestions
    // For now, we'll simulate AI-based suggestions
    const aiGeneratedSuggestions = mockSuggestions.map(s => ({
      ...s,
      score: Math.floor(Math.random() * 30) + 70 // Random score between 70-99
    }));
    
    setSuggestions(aiGeneratedSuggestions);
    
    toast({
      title: 'AI Suggestions Generated',
      description: `Found ${aiGeneratedSuggestions.filter(s => s.score >= 90).length} perfect matches`,
    });
  };

  const addVenue = (name: string, location: string, contactPhone?: string) => {
    const newVenue: Venue = {
      id: `venue-${Date.now()}`,
      name,
      location,
      availability: []
    };
    
    setVenues([...venues, newVenue]);
    toast({
      title: 'Venue Added',
      description: `${name} has been added successfully`,
    });
  };

  const sendInvitation = (bandId: string, name: string, contactInfo: string, method: string) => {
    try {
      const band = bands.find(b => b.id === bandId);
      if (!band) throw new Error('Band not found');

      // Send actual SMS via Twilio edge function
      if (method === 'sms') {
        fetch('https://oapvkhzngfccdcyvolcw.supabase.co/functions/v1/8716b7e6-7a26-4531-9b95-786f5e2d79b0', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: contactInfo,
            name: name,
            bandName: band.name
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            toast({
              title: 'SMS Sent',
              description: `Invitation sent to ${name} at ${contactInfo}`,
            });
          } else {
            throw new Error(data.error || 'Failed to send SMS');
          }
        })
        .catch(error => {
          console.error('Error sending SMS:', error);
          toast({
            title: 'Error',
            description: 'Failed to send SMS. Please try again.',
            variant: 'destructive',
          });
        });
      } else if (method === 'whatsapp') {
        // Open WhatsApp with prefilled message
        const whatsappNumber = contactInfo.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(
          `You've been invited to join ${band.name} on BandSync! Download the app to accept.`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        
        toast({
          title: 'WhatsApp Opened',
          description: `Send the pre-filled message to ${name}`,
        });
      }
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const scheduleRehearsal = async (bandId: string, suggestion: ScheduleSuggestion) => {
    try {
      const band = bands.find(b => b.id === bandId);
      if (!band) throw new Error('Band not found');
      if (!suggestion.venue) throw new Error('Venue information missing');

      // Call the edge function to schedule the rehearsal
      const response = await fetch('https://oapvkhzngfccdcyvolcw.supabase.co/functions/v1/172ef454-e744-4139-a04f-344a1e809bb2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bandId,
          bandName: band.name,
          venueName: suggestion.venue.name,
          venueLocation: suggestion.venue.location,
          startTime: suggestion.start.toISOString(),
          endTime: suggestion.end.toISOString(),
          members: band.members.map(m => ({
            name: m.name,
            phone: m.phone || '',
            email: m.email || ''
          }))
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Rehearsal Scheduled',
          description: `Rehearsal scheduled for ${band.name} at ${suggestion.venue.name}`,
        });
      } else {
        throw new Error(data.error || 'Failed to schedule rehearsal');
      }
      
    } catch (error) {
      console.error('Error scheduling rehearsal:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule rehearsal. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        activePage,
        setActivePage,
        currentUser,
        setCurrentUser,
        bands,
        events,
        venues,
        suggestions,
        createBand,
        deleteBand,
        addMemberToBand,
        generateScheduleSuggestions,
        addVenue,
        sendInvitation,
        scheduleRehearsal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
