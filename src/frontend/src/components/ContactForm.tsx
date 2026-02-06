import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface ContactFormProps {
  onSubmit: (name: string, handle: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function ContactForm({ onSubmit, isSubmitting }: ContactFormProps) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;
    
    await onSubmit(name.trim(), handle.trim());
    setName('');
    setHandle('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              placeholder="@johndoe"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !name.trim() || !handle.trim()} className="w-full">
            {isSubmitting ? 'Adding...' : 'Add Contact'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
