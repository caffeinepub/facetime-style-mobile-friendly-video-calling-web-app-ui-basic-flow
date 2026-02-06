import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { formatPrincipal } from '../utils/principalFormat';

export default function AuthStatus() {
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  if (!identity) return null;

  const principalText = formatPrincipal(identity.getPrincipal().toString());

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground hidden sm:inline">
        {principalText}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={isLoggingIn}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  );
}
