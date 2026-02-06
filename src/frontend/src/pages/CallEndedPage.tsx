import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneOff, Users, Video } from 'lucide-react';

export default function CallEndedPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-[60vh] flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <PhoneOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Call Ended</CardTitle>
          <CardDescription>
            The call has been disconnected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => navigate({ to: '/call-setup' })}
            className="w-full gap-2"
            size="lg"
          >
            <Video className="h-4 w-4" />
            Start New Call
          </Button>
          <Button 
            onClick={() => navigate({ to: '/contacts' })}
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <Users className="h-4 w-4" />
            Back to Contacts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
