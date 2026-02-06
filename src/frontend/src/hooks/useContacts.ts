import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Contact } from '../backend';
import { toast } from 'sonner';

export function useContacts() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const contactsQuery = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContacts();
    },
    enabled: !!actor && !actorFetching,
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, handle }: { name: string; handle: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createContact(name, handle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add contact');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (contactId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContact(contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete contact');
    },
  });

  return {
    contacts: contactsQuery.data,
    isLoading: contactsQuery.isLoading,
    createContact: createMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
