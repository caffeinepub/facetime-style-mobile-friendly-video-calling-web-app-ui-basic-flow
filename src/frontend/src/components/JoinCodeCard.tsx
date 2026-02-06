import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface JoinCodeCardProps {
  sessionId: string;
}

export default function JoinCodeCard({ sessionId }: JoinCodeCardProps) {
  const [copied, setCopied] = useState(false);
  
  const joinLink = `${window.location.origin}/#/call/${sessionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Call Link</CardTitle>
        <CardDescription>
          Share this link with others to join your call
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-3 bg-muted rounded-md break-all text-sm font-mono">
          {joinLink}
        </div>
        <Button onClick={handleCopy} className="w-full gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
