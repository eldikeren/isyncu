import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bandId: string;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({ 
  open, 
  onOpenChange,
  bandId 
}) => {
  const { sendInvitation } = useAppContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [inviteMethod, setInviteMethod] = useState('sms');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && phoneNumber.trim()) {
      setIsSubmitting(true);
      sendInvitation(bandId, name, phoneNumber, inviteMethod);
      resetForm();
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Band Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Member Name</Label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <Tabs value={inviteMethod} onValueChange={setInviteMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sms" className="mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required={inviteMethod === 'sms'}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
                  <Input
                    id="whatsapp-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required={inviteMethod === 'whatsapp'}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
