import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from 'lucide-react';

interface CallControlsProps {
  isMuted: boolean;
  isCameraOn: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
  disabled?: boolean;
}

export default function CallControls({
  isMuted,
  isCameraOn,
  onToggleMute,
  onToggleCamera,
  onEndCall,
  disabled = false,
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant={isMuted ? 'destructive' : 'secondary'}
        size="lg"
        onClick={onToggleMute}
        disabled={disabled}
        className="h-14 w-14 rounded-full"
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      
      <Button
        variant={isCameraOn ? 'secondary' : 'destructive'}
        size="lg"
        onClick={onToggleCamera}
        disabled={disabled}
        className="h-14 w-14 rounded-full"
      >
        {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        disabled
        className="h-14 w-14 rounded-full opacity-50"
        title="Speaker (placeholder)"
      >
        <Volume2 className="h-6 w-6" />
      </Button>
      
      <Button
        variant="destructive"
        size="lg"
        onClick={onEndCall}
        disabled={disabled}
        className="h-14 w-14 rounded-full"
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
}
