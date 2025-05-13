import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Venue } from '@/types';

interface CreateVenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateVenueDialog: React.FC<CreateVenueDialogProps> = ({ open, onOpenChange }) => {
  const { addVenue } = useAppContext();
  const [venueName, setVenueName] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (venueName.trim() && venueLocation.trim()) {
      addVenue(venueName, venueLocation, contactPhone);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setVenueName('');
    setVenueLocation('');
    setContactPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Rehearsal Venue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="venue-name">Venue Name</Label>
              <Input
                id="venue-name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Downtown Studio"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="venue-location">Location</Label>
              <Input
                id="venue-location"
                value={venueLocation}
                onChange={(e) => setVenueLocation(e.target.value)}
                placeholder="123 Main St, City"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input
                id="contact-phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Venue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVenueDialog;
