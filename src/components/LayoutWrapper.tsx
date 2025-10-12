import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayoutWrapperProps {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                Employee Management
              </h1>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant={isAdmin ? "default" : "secondary"} className="capitalize">
                {user?.role}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
