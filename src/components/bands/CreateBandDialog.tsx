import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { PlusCircle } from 'lucide-react';

const CreateBandDialog: React.FC = () => {
  const { createBand } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [bandName, setBandName] = React.useState('');

  const handleCreateBand = () => {
    if (bandName.trim()) {
      createBand(bandName.trim());
      setBandName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Band
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new band</DialogTitle>
          <DialogDescription>
            Enter your band name to get started. You can add members later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Band Name
            </Label>
            <Input
              id="name"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              className="col-span-3"
              placeholder="The Rockers"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateBand} disabled={!bandName.trim()}>
            Create Band
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBandDialog;