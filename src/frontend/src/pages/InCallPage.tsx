import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallSessions, useGetCallSession } from '../hooks/useCallSessions';
import LocalVideoPreview from '../components/LocalVideoPreview';
import CallControls from '../components/CallControls';
import JoinCodeCard from '../components/JoinCodeCard';
import SessionStatusPanel from '../components/SessionStatusPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function InCallPage() {
  const { sessionId } = useParams({ from: '/call/$sessionId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { endSession, isEnding } = useCallSessions();
  const { data: session, isLoading, error } = useGetCallSession(sessionId);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);

  const isCreator = session && identity && session.creator.toString() === identity.getPrincipal().toString();

  useEffect(() => {
    if (error) {
      toast.error('Failed to load call session');
      navigate({ to: '/contacts' });
    }
  }, [error, navigate]);

  useEffect(() => {
    if (session?.state === 'end') {
      navigate({ to: '/call-ended' });
    }
  }, [session?.state, navigate]);

  const handleEndCall = async () => {
    if (!isCreator) {
      toast.info('Only the creator can end the session');
      navigate({ to: '/call-ended' });
      return;
    }

    try {
      await endSession(sessionId);
      toast.success('Call ended');
      navigate({ to: '/call-ended' });
    } catch (error) {
      toast.error('Failed to end call');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="w-full aspect-video" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Call</h1>
        <p className="text-muted-foreground">Session: {sessionId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <LocalVideoPreview 
            isActive={isCameraOn} 
            onCameraReady={() => setCameraReady(true)}
          />
          
          <CallControls
            isMuted={isMuted}
            isCameraOn={isCameraOn}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
            onEndCall={handleEndCall}
            disabled={isEnding || !cameraReady}
          />
        </div>

        <div className="space-y-4">
          {isCreator && <JoinCodeCard sessionId={sessionId} />}
          <SessionStatusPanel session={session} />
        </div>
      </div>
    </div>
  );
}
