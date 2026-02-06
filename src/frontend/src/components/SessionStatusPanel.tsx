import { CallSession } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SessionStatusPanelProps {
  session: CallSession;
}

export default function SessionStatusPanel({ session }: SessionStatusPanelProps) {
  const getStateLabel = () => {
    switch (session.state) {
      case 'pending':
        return 'Waiting for peer';
      case 'active':
        return 'Active';
      case 'end':
        return 'Ended';
      default:
        return 'Unknown';
    }
  };

  const getStateVariant = (): 'default' | 'secondary' | 'destructive' => {
    switch (session.state) {
      case 'pending':
        return 'secondary';
      case 'active':
        return 'default';
      case 'end':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This is a prototype session flow. Real peer-to-peer video connectivity is not implemented.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Session Status
            </span>
            <Badge variant={getStateVariant()}>{getStateLabel()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Created: {new Date(Number(session.createdAt) / 1000000).toLocaleString()}
            </span>
          </div>
          
          {session.peer && (
            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2">Peer Connected:</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{session.peer.handle}</span>
                <Badge variant="outline">{session.peer.status}</Badge>
              </div>
            </div>
          )}
          
          {!session.peer && session.state === 'pending' && (
            <p className="text-sm text-muted-foreground">
              Waiting for someone to join...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
