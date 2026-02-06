import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Shield, Users } from 'lucide-react';

export default function SignInPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/contacts' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/assets/generated/facetime-clone-bg.dim_1600x900.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/facetime-clone-icon.dim_512x512.png" 
            alt="VideoCall" 
            className="h-24 w-24 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-2">VideoCall</h1>
          <p className="text-muted-foreground">Connect with anyone, anywhere</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to start making video calls with your contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">High-Quality Calls</p>
                  <p className="text-xs text-muted-foreground">Crystal clear video and audio</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure & Private</p>
                  <p className="text-xs text-muted-foreground">End-to-end encrypted sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Easy Sharing</p>
                  <p className="text-xs text-muted-foreground">Share links to join calls instantly</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
