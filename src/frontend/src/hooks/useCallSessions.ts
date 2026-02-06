import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CallSession } from '../backend';

export function useCallSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCallSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callSessions'] });
    },
  });

  const joinMutation = useMutation({
    mutationFn: async ({ sessionId, handle }: { sessionId: string; handle: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinCallSession(sessionId, handle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callSessions'] });
    },
  });

  const endMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.endCallSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callSessions'] });
    },
  });

  return {
    createSession: createMutation.mutateAsync,
    joinSession: joinMutation.mutateAsync,
    endSession: endMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isJoining: joinMutation.isPending,
    isEnding: endMutation.isPending,
  };
}

export function useGetCallSession(sessionId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CallSession>({
    queryKey: ['callSession', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallSession(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
    refetchInterval: 3000, // Poll every 3 seconds for updates
  });
}
