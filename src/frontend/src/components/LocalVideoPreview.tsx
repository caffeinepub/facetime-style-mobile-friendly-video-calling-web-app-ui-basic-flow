import { useEffect, useRef } from 'react';
import { useCamera } from '../camera/useCamera';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocalVideoPreviewProps {
  isActive: boolean;
  onCameraReady?: () => void;
}

export default function LocalVideoPreview({ isActive, onCameraReady }: LocalVideoPreviewProps) {
  const {
    isActive: cameraActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'user',
    width: 1280,
    height: 720,
  });

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (isActive && !hasStartedRef.current && isSupported) {
      hasStartedRef.current = true;
      startCamera().then((success) => {
        if (success && onCameraReady) {
          onCameraReady();
        }
      });
    } else if (!isActive && hasStartedRef.current) {
      hasStartedRef.current = false;
      stopCamera();
    }
  }, [isActive, isSupported, startCamera, stopCamera, onCameraReady]);

  if (isSupported === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Camera is not supported in your browser. Please use a modern browser with camera support.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.type === 'permission' 
            ? 'Camera permission denied. Please allow camera access to continue.'
            : `Camera error: ${error.message}`}
        </AlertDescription>
        {error.type === 'permission' && (
          <Button variant="outline" size="sm" onClick={startCamera} className="mt-2">
            Try Again
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
            <p>Starting camera...</p>
          </div>
        </div>
      )}
      
      {!cameraActive && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2" />
            <p>Camera off</p>
          </div>
        </div>
      )}
    </div>
  );
}
