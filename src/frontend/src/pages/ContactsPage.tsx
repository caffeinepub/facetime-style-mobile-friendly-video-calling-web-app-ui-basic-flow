import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Video, Plus } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import ContactsList from '../components/ContactsList';
import { useContacts } from '../hooks/useContacts';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactsPage() {
  const navigate = useNavigate();
  const { contacts, isLoading, createContact, deleteContact, isCreating, isDeleting } = useContacts();

  const handleCreateContact = async (name: string, handle: string) => {
    await createContact({ name, handle });
  };

  const handleDeleteContact = async (contactId: bigint) => {
    await deleteContact(contactId);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage your contacts and start calls</p>
        </div>
        <Button onClick={() => navigate({ to: '/call-setup' })} className="gap-2">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">New Call</span>
        </Button>
      </div>

      <ContactForm onSubmit={handleCreateContact} isSubmitting={isCreating} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Contacts</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <ContactsList 
            contacts={contacts || []} 
            onDelete={handleDeleteContact}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
