import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-2xl mx-auto border-terracotta/30">
          <ShieldAlert className="h-5 w-5 text-terracotta" />
          <AlertTitle className="text-terracotta">Authentication Required</AlertTitle>
          <AlertDescription>Please log in to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-2xl mx-auto border-destructive/30">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive">Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access this page. Admin privileges are required.
          </AlertDescription>
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            className="mt-4 border-sage hover:bg-sage/10"
          >
            Return to Home
          </Button>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
