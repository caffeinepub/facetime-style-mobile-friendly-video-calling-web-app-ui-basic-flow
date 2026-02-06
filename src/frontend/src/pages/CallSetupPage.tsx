import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, LogIn } from 'lucide-react';
import { useCallSessions } from '../hooks/useCallSessions';
import { toast } from 'sonner';

export default function CallSetupPage() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [handle, setHandle] = useState('');
  const { createSession, joinSession, isCreating, isJoining } = useCallSessions();

  const handleCreateCall = async () => {
    try {
      const session = await createSession();
      toast.success('Call session created!');
      navigate({ to: '/call/$sessionId', params: { sessionId: session.id } });
    } catch (error) {
      toast.error('Failed to create call session');
    }
  };

  const handleJoinCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !handle.trim()) return;

    try {
      const session = await joinSession({ sessionId: joinCode.trim(), handle: handle.trim() });
      toast.success('Joined call session!');
      navigate({ to: '/call/$sessionId', params: { sessionId: session.id } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to join call session');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Start or Join a Call</h1>
        <p className="text-muted-foreground">Create a new call or join an existing one</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Call</TabsTrigger>
          <TabsTrigger value="join">Join Call</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Create New Call
              </CardTitle>
              <CardDescription>
                Start a new video call and share the link with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateCall} 
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating ? 'Creating...' : 'Create Call Session'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Join Existing Call
              </CardTitle>
              <CardDescription>
                Enter the session code to join a call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinCall} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="handle">Your Name</Label>
                  <Input
                    id="handle"
                    placeholder="Enter your name"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    disabled={isJoining}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Session Code</Label>
                  <Input
                    id="joinCode"
                    placeholder="Enter session code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    disabled={isJoining}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isJoining || !joinCode.trim() || !handle.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isJoining ? 'Joining...' : 'Join Call'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
