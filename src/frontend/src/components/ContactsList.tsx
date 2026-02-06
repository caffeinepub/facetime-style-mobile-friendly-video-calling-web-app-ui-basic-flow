import { Contact } from '../backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactsListProps {
  contacts: Contact[];
  onDelete: (contactId: bigint) => Promise<void>;
  isDeleting: boolean;
}

export default function ContactsList({ contacts, onDelete, isDeleting }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No contacts yet. Add your first contact above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <Card key={contact.id.toString()}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {contact.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.handle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(contact.id)}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
